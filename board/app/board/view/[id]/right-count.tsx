"use client";

import { Box, Stack, Typography, IconButton } from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { usePostLike } from "../../../hook/boardView";

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
  const { likeCount, liked, toggleLike } = usePostLike(
    post.id,
    userId,
    post.like_count
  );

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
          onClick={toggleLike}
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
