"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("post")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("post")
      .update({
        title,
        content,
        category,
      })
      .eq("id", id);

    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }

    alert("수정 완료");
    router.push(`/board/view/${id}`);
  };

  if (loading) return <Typography>불러오는 중...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={6}
        />
        <TextField
          label="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleSubmit}>
          수정 완료
        </Button>
      </Box>
    </Container>
  );
}
