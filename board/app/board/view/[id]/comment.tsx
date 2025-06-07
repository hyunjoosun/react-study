"use client";

import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface CommentType {
  id: string;
  content: string;
  username: string;
  created_at: string;
}

export default function Comment() {
  const currentUser = "username";
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentContent, setCommentContent] = useState<string>('');
  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  async function handleEditSubmit(commentId: string) {
    if (!editContent.trim()) return;

    setCommentLoading(true);

    const { data, error } = await supabase
      .from('comment')
      .update({ content: editContent })
      .eq('id', commentId)
      .select();

    if (error) {
      console.error("댓글 수정 실패", error);
    } else {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, content: editContent } : comment
        )
      );
      setEditingCommentId(null);
      setEditContent('');
    }

    setCommentLoading(false);
  }

  async function handleDelete(commentId: string) {
    const confirmDelete = confirm("댓글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setCommentLoading(true);

    const { error } = await supabase
      .from('comment')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error("댓글 삭제 실패", error);
    } else {
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    }

    setCommentLoading(false);
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comment')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('댓글 불러오기 실패', error);
    } else {
      setComments(data);
    }
  }

  useEffect(() => {
    fetchComments();
  }, []);

  async function handleCommentSubmit() {
    if (!commentContent.trim()) return;

    setCommentLoading(true);

    const { data, error } = await supabase
      .from('comment')
      .insert([{ content: commentContent, username: currentUser }])
      .select();

    if (error) {
      console.error('댓글 등록 실패', error);
    } else {
      setComments((prev) => [data[0], ...prev]);
      setCommentContent('');
    }

    setCommentLoading(false);
  }

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          댓글 ({comments.length})
        </Typography>
        {comments.length === 0 && (
          <Typography color="text.secondary">등록된 댓글이 없습니다.</Typography>
        )}
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ mb: 2, p: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {comment.username} | {new Date(comment.created_at).toLocaleString()}
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
                <Typography variant="body1">{comment.content}</Typography>
                {comment.username === currentUser && (
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
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="댓글 작성"
          multiline
          minRows={3}
          fullWidth
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          disabled={commentLoading}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={commentLoading}
        >
          댓글 등록
        </Button>
      </Box>
    </>
  );
}
