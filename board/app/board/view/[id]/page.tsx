"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "next/navigation"; 
import {
  List as ListIcon,
} from "@mui/icons-material";
import Comment from "./comment";
import BoardTop from "../../board-top";
import RightCount from "./right-count";
import { usePostDetail } from "../../../hook/board";
import { useUser } from '@supabase/auth-helpers-react';

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const user = useUser();
  const userId = user?.id;
  const { post, username, loading, error } = usePostDetail(id, userId);

  useEffect(() => {
    console.log("userId:", user?.id);
  }, [user]);

  if (!post) return <Typography>게시글이 존재하지 않습니다.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoardTop />

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Chip size="small" sx={{ mb: 2 }} label={post.category} />
          <Typography variant="h4" gutterBottom>{post.title}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              작성일: {new Date(post.created_at).toLocaleDateString()}
            </Typography>

            <RightCount post={post} userId={userId} />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {post.thumbnail && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.thumbnail}
              alt="게시글 이미지"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Comment postId={post.id}/>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button variant="outlined" href={`/board/edit/${post.id}`}>
          수정
        </Button>

          <Button variant="contained" startIcon={<ListIcon />} href="/board">
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
