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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const categories = ["공지사항", "정보", "일반", "질문"];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("게시글 불러오기 실패:", error);
        setLoading(false);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setThumbnail(data.thumbnail || null);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnailFile(file);
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const handleThumbnailDelete = () => {
    setNewThumbnailFile(null);
    setThumbnail(null);
  };

  const handleCancel = () => {
    router.push(`/board/view/${id}`);
  };

  const handleSubmit = async () => {
    let thumbnailUrl = thumbnail;

    if (newThumbnailFile) {
      const fileExt = newThumbnailFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, newThumbnailFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert("썸네일 업로드 실패: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("thumbnails")
        .getPublicUrl(filePath);

      thumbnailUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        thumbnail: thumbnailUrl,
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
        {/* 카테고리 셀렉트 */}
        <FormControl fullWidth>
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="카테고리"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

        {/* 썸네일 미리보기 */}
        {thumbnail && (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={thumbnail}
              alt="썸네일 미리보기"
              style={{ maxWidth: "100%", marginTop: "1rem" }}
            />
            <Button color="error" onClick={handleThumbnailDelete}>
              썸네일 삭제
            </Button>
          </Box>
        )}

        <Button variant="outlined" component="label">
          썸네일 이미지 업로드
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </Button>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            수정 완료
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
