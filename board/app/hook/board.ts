import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SelectChangeEvent } from "@mui/material";

interface UseBoardProps {
  category: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export type PostType = {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  category: string;
  author: { username: string };
};

const ITEMS_PER_PAGE = 10;

interface UsePostsProps {
  page: number;
  category: string;
  search: string;
  onTotalChange: (total: number) => void;
}

export type CommentType = {
  id: string;
  username: string;
  content: string;
  created_at: string;
};
export function usePosts({
    page,
    category,
    search,
    onTotalChange,
  }: UsePostsProps): PostType[] {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("post")
        .select("*, author:author_id(username)", { count: "exact" });

    if (category && category !== "all") {
        query = query.eq("category", category);
      }

      if (search) {
        query = query.ilike("title", `%${search}%`);
      }

      const { data: postData, error, count } = await query.range(from, to);

      if (error) {
        console.error("게시글 불러오기 오류:", error.message);
        return;
      }

      const { data: commentData } = await supabase
        .from("comment")
        .select("*");

      const postsWithCount = (postData || []).map((post) => ({
        ...post,
        comment_count:
          commentData?.filter((c) => c.post_id === post.id).length || 0,
      }));

      setPosts(postsWithCount);
      onTotalChange?.(count || 0);
    };

    fetchPosts();
  }, [page, category, search]);

  return posts;
}

export function useBoard({
  category,
  search,
  onCategoryChange,
  onSearch,
}: UseBoardProps) {
  const [localCategory, setLocalCategory] = useState<string>(category);
  const [inputValue, setInputValue] = useState<string>(search);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => setLocalCategory(category), [category]);
  useEffect(() => setInputValue(search), [search]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase.from("post").select("category");
        if (error) throw error;

        if (data) {
          const uniqueCategories = Array.from(
            new Set(data.map((item) => item.category))
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("카테고리 불러오기 에러:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setLocalCategory(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onCategoryChange(localCategory);
    onSearch(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleSearchClick = () => handleSearch();

  return {
    localCategory,
    inputValue,
    categories,
    handleCategoryChange,
    handleInputChange,
    handleKeyDown,
    handleSearchClick,
  };
}

export function usePostDetail(id: string) {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        await supabase.rpc("increment_view_count", { post_id: id });

        const { data: postData, error: postError } = await supabase
          .from("post")
          .select("*")
          .eq("id", id)
          .single();

          if (postError) {
            console.error("Post fetch error:", postError.message, postError);
            throw postError;
          }

        const { data: commentsData, error: commentsError } = await supabase
          .from("comment")
          .select("*")
          .order("created_at", { ascending: true });

          if (commentsError) {
            console.error("Comments fetch error:", commentsError.message, commentsError);
            throw commentsError;
          }

        setPost({
            ...postData,
            comment_count: (commentsData || []).length, 
          });
    
          setComments(commentsData || []);
        } catch (error: any) {
          console.error("게시글 상세 데이터 불러오기 에러:", error?.message || error);
        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [id]);

  return { post, comments, loading, setPost, setComments };
}
