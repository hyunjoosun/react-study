"use client";

import { Box, Button, TextField } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useCommentForm } from "../../../hook/boardView";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const user = useUser();

  const { content, setContent, handleSubmit } = useCommentForm(
    postId,
    user,
    onCommentAdded
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="댓글 작성"
        multiline
        minRows={3}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        댓글 등록
      </Button>
    </Box>
  );
}
