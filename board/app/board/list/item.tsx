"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";

interface ItemsProps {
  category: string;
  keyword: string;
  page: number;
  onPageChange: (page: number) => void;
}

interface PostProps {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  category?: string;
  created_at: string;
  view_count: number;
  comment_count: number;
  like_count: number;
  author_id: string;
  profiles: {
    username: string;
    name: string;
  };
}

export default function Items({
  category,
  keyword,
  page,
  onPageChange,
}: ItemsProps) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("posts")
        .select(
          `
          *,
          profiles(username, name)
          `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      if (category !== "all") query = query.eq("category", category);
      if (keyword) query = query.ilike("title", `%${keyword}%`);

      const { data, count, error } = await query.range(from, to);

      if (error) {
        console.error("에러:", error.message);
      } else {
        setPosts(data || []);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
      setLoading(false);
    };

    fetchPosts();
  }, [category, keyword, page]);

  if (loading) {
    return <Typography>로딩중</Typography>;
  }

  if (!posts.length) {
    return <Typography>게시글이 없습니다.</Typography>;
  }

  return (
    <>
      {posts.map((post) => (
        <Card key={post.id} sx={{ display: "flex", height: 200 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={post.thumbnail || "/noimg.webp"}
            alt={post.title}
          />
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ mb: 1 }}>
              <Chip
                size="small"
                sx={{ mr: 1 }}
                label={post.category || "일반"}
              />
            </Box>
            <Typography
              variant="h6"
              component="a"
              href={`/board/view/${post.id}`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {post.content}
            </Typography>
            <Box sx={{ mt: "auto" }}>
              <Typography variant="body2" color="text.secondary">
                작성자: {post.profiles?.username} | 작성일:{" "}
                {post.created_at
                  ? format(new Date(post.created_at), "yyyy-MM-dd")
                  : "-"}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {post.view_count ?? 0}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CommentIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {post.comment_count ?? 0}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {post.like_count ?? 0}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          showFirstButton
          showLastButton
          onChange={(_, value) => onPageChange(value)}
        />
      </Box>
    </>
  );
}
