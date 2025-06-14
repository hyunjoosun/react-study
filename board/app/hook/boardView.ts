import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/auth-helpers-react";
import { Post, CommentWithProfile } from "../types";

export interface Comment {
  id: number;
  post_id: number;
  author_id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
    name: string;
  };
}

// 게시판 상세
export function useBoardView(postId: number | null) {
  const [post, setPost] = useState<Post | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPostDetail = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error("게시글 상세 정보 불러오기 오류:", error);
        return;
      }

      setPost(data);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.author_id)
        .single();

      if (profileError) {
        console.error("유저 이름 가져오기 실패:", profileError.message);
      } else {
        setUsername(profile?.username || "알 수 없음");
      }

      await supabase
        .from("posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", postId);
    };

    fetchPostDetail();
  }, [postId]);

  return { post, username };
}

// 게시판 상세 - 오른쪽 카운터
export function usePostLike(
  postId: string,
  userId?: string,
  initialLikeCount = 0
) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLiked = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (data) setLiked(true);
    };

    checkLiked();
  }, [postId, userId]);

  const toggleLike = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      await supabase
        .from("posts")
        .update({ like_count: likeCount - 1 })
        .eq("id", postId);

      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await supabase.from("post_likes").insert({
        post_id: postId,
        user_id: userId,
      });

      await supabase
        .from("posts")
        .update({ like_count: likeCount + 1 })
        .eq("id", postId);

      setLikeCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return { likeCount, liked, toggleLike };
}

// 게시판 상세 - 댓글
export function useComment(
  postId: number,
  onCommentCountChange: (count: number) => void
) {
  const [refreshKey, setRefreshKey] = useState<boolean>(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      onCommentCountChange(count || 0);
    };

    fetchCount();
  }, [postId, refreshKey]);

  const handleCommentAdded = () => setRefreshKey((prev) => !prev);

  return {
    refreshKey,
    handleCommentAdded,
  };
}

// 게시판 상세 - 댓글 리스트
export function useCommentList(postId: number) {
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(username, name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("댓글 불러오기 오류:", error.message);
    } else {
      setComments(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleEditSubmit = async (commentId: number) => {
    if (!editContent.trim()) return;

    setCommentLoading(true);
    const { error } = await supabase
      .from("comments")
      .update({ content: editContent })
      .eq("id", commentId);

    if (error) {
      console.error("댓글 수정 오류:", error.message);
    } else {
      await fetchComments();
      setEditingCommentId(null);
    }
    setCommentLoading(false);
  };

  const handleDelete = async (commentId: number) => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    setCommentLoading(true);
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("댓글 삭제 오류:", error.message);
    } else {
      await fetchComments();
    }
    setCommentLoading(false);
  };

  return {
    comments,
    loading,
    commentLoading,
    editingCommentId,
    editContent,
    setEditContent,
    setEditingCommentId,
    handleEditSubmit,
    handleDelete,
  };
}

// 게시판 상세 - 댓글 폼
export function useCommentForm(
  postId: number,
  user: User | null,
  onCommentAdded: () => void
) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        author_id: user.id,
        content: content.trim(),
      },
    ]);

    if (error) {
      alert("댓글 등록 실패: " + error.message);
    } else {
      setContent("");
      onCommentAdded();
    }
  };

  return {
    content,
    setContent,
    handleSubmit,
  };
}
