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
import React, { useEffect, useState } from "react";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { supabase } from "../../../src/lib/supabaseClient";
import { format } from "date-fns";

type PostTtpe = {
  id: string;
  title: string;
  content: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  category: string;
  author: {
    username: string;
  };
};

interface ItemProps {
  page: number;
  category: string;
  search: string;
  onTotalChange: (total: number) => void;
}

const ITEMS_PER_PAGE = 15;

export default function Items({
  page,
  category,
  search,
  onTotalChange,
}: ItemProps) {
  //   const { data: post, error } = await supabase.from("post").select("*");
  //   console.log("게시판", post);

  //   useEffect(() => {
  //     getData();
  //   }, []);

  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<PostTtpe[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase.from("post").select("*, author:author_id(username)");

      if (category !== "all") {
        query = query.eq("카테고리", category);
      }
      if (search) {
        query = query.or("검색");
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.log("에러:", error);
        return;
      }

      if (data) {
        setPosts(data as PostTtpe[]);
      }

      if (count) {
        onTotalChange(Math.ceil(count / ITEMS_PER_PAGE));
      }
    };

    fetchPosts();
  }, [page, category, search, onTotalChange]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      {posts.map((post) => (
        <Card key={post.id} sx={{ display: "flex", height: 200 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={post.thumbnail_url || "../../noimg.webp"}
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
                작성자: {post.author?.username} | 작성일:{" "}
                {format(new Date(post.created_at), "yyyy-MM-dd")}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.view_count}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CommentIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.comment_count}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.like_count}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination color="primary" page={page} onChange={handlePageChange} />
      </Box>
    </>
  );
}
