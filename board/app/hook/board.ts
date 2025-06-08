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
  thumbnail: string;
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
        .select(`
          *,
          author:author_id(username),
          comment(id)
        `, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
    
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
    
      if (search) {
        query = query.ilike("title", `%${search}%`);
      }
    
      const { data: postData, error, count } = await query;
    
      if (error) {
        console.error("게시글 불러오기 오류:", error.message);
        return;
      }
    
      const postsWithCount = (postData || []).map((post) => ({
        ...post,
        comment_count: post.comments?.length ?? 0,
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

export function usePostDetail(postId: string, userId?: string) {
  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // 게시글 상세 정보 가져오기
        const { data: postData, error: postError } = await supabase
          .from("post")
          .select(`
            *,
            author:author_id(username)
          `)
          .eq("id", postId)
          .single();

        if (postError) throw postError;

        // 조회수 증가
        const { error: updateError } = await supabase
          .from("post")
          .update({ view_count: (postData.view_count || 0) + 1 })
          .eq("id", postId);

        if (updateError) throw updateError;

        // 댓글 목록 가져오기
        const { data: commentData, error: commentError } = await supabase
          .from("comment")
          .select("*")
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (commentError) throw commentError;

        // 댓글 작성자 정보 가져오기
        const commentAuthors = await Promise.all(
          commentData.map(async (comment) => {
            const { data: authorData } = await supabase
              .from("user")
              .select("username")
              .eq("id", comment.author_id)
              .single();
            return {
              ...comment,
              author: authorData || { username: "Unknown" },
            };
          })
        );

        // 댓글 수 업데이트
        const { error: countError } = await supabase
          .from("post")
          .update({ comment_count: commentAuthors.length })
          .eq("id", postId);

        if (countError) throw countError;

        setPost({
          ...postData,
          comment_count: commentAuthors.length,
        });
        setComments(commentAuthors);
      } catch (err) {
        console.error("게시글 상세 정보 불러오기 오류:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  useEffect(() => {
    if (!userId) {
      setUsername(null);
      return;
    }

    const fetchUsername = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("username")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("유저 이름 가져오기 실패:", error);
        setUsername(null);
      } else {
        setUsername(data?.username ?? null);
      }
    };

    fetchUsername();
  }, [userId]);

  const addComment = async (content: string, userId: string) => {
    try {
      const { data: newComment, error: commentError } = await supabase
        .from("comment")
        .insert([
          {
            content,
            post_id: postId,
            author_id: userId,
          },
        ])
        .select()
        .single();

      if (commentError) throw commentError;

      // 작성자 정보 가져오기
      const { data: authorData } = await supabase
        .from("user")
        .select("username")
        .eq("id", userId)
        .single();

      const commentWithAuthor = {
        ...newComment,
        author: authorData || { username: "Unknown" },
      };

      // 댓글 목록 업데이트
      setComments((prev) => [...prev, commentWithAuthor]);

      // 해당 게시글의 댓글 수만 업데이트
      const { error: countError } = await supabase
        .from("post")
        .update({ comment_count: comments.length + 1 })
        .eq("id", postId);

      if (countError) throw countError;

      // 현재 게시글의 댓글 수 업데이트
      setPost((prev) => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null);

      return commentWithAuthor;
    } catch (err) {
      console.error("댓글 작성 오류:", err);
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("comment")
        .delete()
        .eq("id", commentId);

      if (deleteError) throw deleteError;

      // 댓글 목록에서 삭제
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));

      // 해당 게시글의 댓글 수만 업데이트
      const { error: countError } = await supabase
        .from("post")
        .update({ comment_count: comments.length - 1 })
        .eq("id", postId);

      if (countError) throw countError;

      // 현재 게시글의 댓글 수 업데이트
      setPost((prev) => prev ? { ...prev, comment_count: prev.comment_count - 1 } : null);
    } catch (err) {
      console.error("댓글 삭제 오류:", err);
      throw err;
    }
  };

  return {
    post,
    comments,
    loading,
    error,
    username,
    addComment,
    deleteComment,
  };
}
