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
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentContent, setCommentContent] = useState<string>('');
    const [commentLoading, setCommentLoading] = useState<boolean>(false);

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
          .insert([{ content: commentContent, username: 'username' }]) 
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
          <Box
            key={comment.id}
            sx={{ mb: 2, p: 1, }}
          >
            <Typography variant="subtitle2" color="text.secondary">
                {comment.username} | {new Date(comment.created_at).toLocaleString()}
            </Typography>
            <Typography variant="body1">{comment.content}</Typography>
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
