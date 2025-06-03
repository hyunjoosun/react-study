"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  category: string;
  title: string;
  content: string;
  thumbnail: FileList | null;
};

export default function WritePage() {
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormData>({
    defaultValues: {
      category: "",
      title: "",
      content: "",
      thumbnail: null,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append("category", data.category);
      formData.append("title", data.title);
      formData.append("content", data.content);
      
      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }
  
      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error("등록 실패");
      }
  
      alert("글이 성공적으로 등록되었습니다!");
      window.location.href = "/board";
  
    } catch (err) {
      console.error("등록 중 에러:", err);
      alert("글 등록 중 오류가 발생했습니다.");
    }
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (files: FileList | null) => void) => {
    const files = e.target.files;
    onChange(files);

    if (files && files.length > 0) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          글쓰기
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
            <InputLabel id="category-label">카테고리</InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: "카테고리를 선택해주세요" }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="category-label"
                  label="카테고리"
                >
                  <MenuItem value="">카테고리 선택</MenuItem>
                  <MenuItem value="general">일반</MenuItem>
                  <MenuItem value="news">뉴스</MenuItem>
                  <MenuItem value="event">이벤트</MenuItem>
                </Select>
              )}
            />
            {errors.category && (
              <Typography variant="caption" color="error">
                {errors.category.message}
              </Typography>
            )}
          </FormControl>

          <Controller
            name="title"
            control={control}
            rules={{ required: "제목을 입력해주세요" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="제목"
                error={!!errors.title}
                helperText={errors.title?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="content"
            control={control}
            rules={{ required: "내용을 입력해주세요" }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="내용"
                multiline
                rows={10}
                error={!!errors.content}
                helperText={errors.content?.message}
                sx={{ mb: 2 }}
              />
            )}
          />

          <Controller
            name="thumbnail"
            control={control}
            render={({ field: { onChange } }) => (
              <Box sx={{ mb: 2 }}>
                <input
                  type="file"
                  accept="image/*"
                  id="thumbnail"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, onChange)}
                />
                <label htmlFor="thumbnail">
                  <Button variant="outlined" component="span">
                    썸네일 업로드
                  </Button>
                </label>
                <Box sx={{ mt: 2 }}>
                  {preview && (
                    <img
                      alt="Thumbnail preview"
                      src={preview}
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  )}
                </Box>
              </Box>
            )}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button variant="outlined" href="/board">
              취소
            </Button>
            <Button type="submit" variant="contained">
              등록
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
