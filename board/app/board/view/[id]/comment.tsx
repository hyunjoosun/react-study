"use client";

import { Box, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import CommentList from "./comment-list";
import CommentForm from "./comment-form";

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
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);
      onCommentCountChange(count || 0);
    };

    fetchCount();
  }, [postId, refresh]);

  const handleCommentAdded = () => setRefresh((prev) => !prev);

  return (
    <>
      <Box>
        <Typography variant="h6" gutterBottom>
          댓글 ({commentCount})
        </Typography>

        <CommentList key={refresh.toString()} postId={postId} />
      </Box>

      <Divider sx={{ my: 3 }} />

      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
    </>
  );
}
