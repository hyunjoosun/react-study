"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface Comment {
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

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const user = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [commentLoading, setCommentLoading] = useState<boolean>(false);

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
      setComments(data);
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

  if (loading) return <Typography variant="body2">로딩중...</Typography>;
  if (comments.length === 0)
    return <Typography variant="body2">아직 댓글이 없습니다.</Typography>;

  return (
    <>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2, p: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {comment.profiles?.username} |{" "}
            {new Date(comment.created_at).toLocaleString()}
          </Typography>

          {editingCommentId === comment.id ? (
            <>
              <TextField
                multiline
                minRows={3}
                fullWidth
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={commentLoading}
              />
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => handleEditSubmit(comment.id)}
                  disabled={commentLoading || !editContent.trim()}
                >
                  수정 완료
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditingCommentId(null)}
                  disabled={commentLoading}
                >
                  취소
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {comment.content}
              </Typography>
              {comment.author_id === user?.id && (
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(comment.id)}
                    disabled={commentLoading}
                  >
                    삭제
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      ))}
    </>
  );
}
