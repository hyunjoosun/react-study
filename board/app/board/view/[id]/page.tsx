"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "next/navigation"; 
import {
  List as ListIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import Comment from "./comment";
import { usePostDetail } from "../../../hook/board";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { post } = usePostDetail(id);

  if (!post) return <Typography>게시글이 존재하지 않습니다.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
            <Stack direction="row" spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2">{post.view_count}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CommentIcon fontSize="small" />
                <Typography variant="body2">{post.comment_count}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2">{post.like_count}</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {post.thumbnail_url && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.thumbnail_url}
              alt="게시글 이미지"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Comment />

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
