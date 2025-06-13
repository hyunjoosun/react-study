"use client";

import { Box, Divider, Typography } from "@mui/material";
import CommentList from "./comment-list";
import CommentForm from "./comment-form";
import { useComment } from "../../../hook/boardView";

interface CommentProps {
  postId: number;
  commentCount: number;
  onCommentCountChange: (count: number) => void;
}

export default function Comment({
  postId,
  commentCount,
  onCommentCountChange,
}: CommentProps) {
  const { refreshKey, handleCommentAdded } = useComment(
    postId,
    onCommentCountChange
  );

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          댓글 ({commentCount})
        </Typography>

        <CommentList key={refreshKey.toString()} postId={postId} />
      </Box>

      <Divider sx={{ my: 3 }} />

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
    </>
  );
}
