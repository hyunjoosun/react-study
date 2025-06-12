"use client";

import { Box, Stack, Typography, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

interface RightCountProps {
  post: {
    id: string;
    view_count: number;
    like_count: number;
  };
  userId?: string;
  commentCount: number;
}

export default function RightCount({
  post,
  userId,
  commentCount,
}: RightCountProps) {
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [liked, setLiked] = useState<boolean>(false);

  useEffect(() => {
    const checkLiked = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", userId)
        .single();

      if (data) setLiked(true);
    };

    checkLiked();
  }, [post.id, userId]);

  const handleLikeToggle = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (liked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);

      await supabase
        .from("posts")
        .update({ like_count: likeCount - 1 })
        .eq("id", post.id);

      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await supabase.from("post_likes").insert({
        post_id: post.id,
        user_id: userId,
      });

      await supabase
        .from("posts")
        .update({ like_count: likeCount + 1 })
        .eq("id", post.id);

      setLikeCount((prev) => prev + 1);
      setLiked(true);
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
        <Typography variant="body2">{commentCount}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton
          onClick={handleLikeToggle}
          size="small"
          color={liked ? "error" : "default"}
          disabled={!userId}
        >
          <FavoriteIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2">{likeCount}</Typography>
      </Box>
    </Stack>
  );
}
