"use client";

import { useState } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";

type FormData = {
  category: string;
  title: string;
  content: string;
  thumbnail: FileList | null;
};

const categories = ["공지사항", "정보", "일반", "질문"];

export default function WritePage() {
  const router = useRouter();
  const user = useUser();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      category: "",
      title: "",
      content: "",
      thumbnail: null,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(e.target.files);
      setPreview(URL.createObjectURL(file));
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    let thumbnailUrl = null;

    if (data.thumbnail && data.thumbnail.length > 0) {
      const file = data.thumbnail[0];
      const { data: storageData, error: uploadError } = await supabase.storage
        .from("thumbnail")
        .upload(`public/${Date.now()}-${file.name}`, file);

      if (uploadError) {
        console.error(uploadError);
        alert("썸네일 업로드 중 오류가 발생했습니다.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("thumbnail").getPublicUrl(storageData.path);

      thumbnailUrl = publicUrl;
    }

    const { error } = await supabase.from("posts").insert({
      title: data.title,
      content: data.content,
      category: data.category,
      thumbnail: thumbnailUrl,
      author_id: user.id,
    });

    if (error) {
      console.error(error);
      alert("글 등록 중 오류가 발생했습니다.");
    } else {
      alert("글이 성공적으로 등록되었습니다.");
      router.push("/board");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            글쓰기
          </Typography>
          <Button variant="outlined" href="/board">
            홈
          </Button>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.category}>
            <InputLabel id="category-label">카테고리</InputLabel>
            <Controller
              name="category"
              control={control}
              rules={{ required: "카테고리를 선택해주세요" }}
              render={({ field }) => (
                <Select {...field} labelId="category-label" label="카테고리">
                  <MenuItem value="">카테고리 선택</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
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
                {preview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={preview}
                      alt="썸네일 미리보기"
                      style={{ maxWidth: 200, maxHeight: 200 }}
                    />
                    <Button
                      variant="text"
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        onChange(null);
                        setPreview(null);
                      }}
                    >
                      썸네일 삭제
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
