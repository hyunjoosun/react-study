"use client";

import {
  Box,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";

type RightCountProps = {
  post: {
    view_count: number;
    comment_count: number;
    like_count: number;
    id: string;
  };
  userId: string | undefined;
};

export default function RightCount({ post, userId }: RightCountProps) {
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.like_count);

  const storageKey = `post_${post.id}_liked_by_${userId}`;

  React.useEffect(() => {
    console.log("userId:", userId);
    if (!userId) return;
    const saved = localStorage.getItem(storageKey);
    setLiked(saved === "true");
    setLikeCount(post.like_count);
  }, [post.like_count, storageKey, userId]);

  const handleLikeToggle = () => {
    if (!userId) {
      alert("좋아요는 로그인 후 가능합니다.");
      return;
    }

    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
      localStorage.removeItem(storageKey);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      localStorage.setItem(storageKey, "true");
    }

  };

  return (
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
        <IconButton onClick={handleLikeToggle} size="small" color={liked ? "error" : "default"}>
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">{likeCount}</Typography>
      </Box>
    </Stack>
  );
}
