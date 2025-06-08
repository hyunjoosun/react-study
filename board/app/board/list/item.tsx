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
import React from "react";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { usePosts } from "../../hook/board";

interface ItemProps {
  page: number;
  category: string;
  search: string;
  onTotalChange: (total: number) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
}

export default function Items({
  page,
  category,
  search,
  onTotalChange,
  onPageChange,
  totalPage,
}: ItemProps) {
  const posts = usePosts({ page, category, search, onTotalChange, onPageChange});
  
  return (
    <>
      {posts.map((post) => (
        <Card key={post.id} sx={{ display: "flex", height: 200 }}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={post.thumbnail || "../../noimg.webp"}
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
        <Pagination
          color="primary"
          page={page}
          count={totalPage}
          onChange={(_, value) => onPageChange(value)}
        />
      </Box>
    </>
  );
}
