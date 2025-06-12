"use client";

import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState<string>("");
  const user = useUser();

  const handleSubmit = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase.from("comments").insert([
      {
        post_id: postId,
        author_id: user.id,
        content: content.trim(),
      },
    ]);

    if (error) {
      alert("댓글 등록 실패: " + error.message);
    } else {
      setContent("");
      onCommentAdded();
    }
  };

  return (
    <>
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
    </>
  );
}
