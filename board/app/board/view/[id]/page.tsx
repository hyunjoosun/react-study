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
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  List as ListIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

type PostType = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  view_count: number;
  comment_count: number;
  like_count: number;
  image_url?: string;
};

export default function PostDetailPage() {
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params?.id as string;

  
useEffect(() => {
  const fetchPost = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("에러:", error);
    } else {
      setPost(data);
    }

    setLoading(false);
  };

  fetchPost();
}, [id]);

  if (loading) return <Typography>불러오는 중...</Typography>;
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

        {post.image_url && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.image_url}
              alt="게시글 이미지"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" startIcon={<ListIcon />} href="/board">
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
