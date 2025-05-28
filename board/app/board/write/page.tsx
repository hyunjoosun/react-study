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
import React from "react";

export default function WritePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          글쓰기
        </Typography>
        <Box component="form">
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-label">카테고리</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              label="카테고리"
              required
            >
              <MenuItem>카테고리</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="제목"
            name="title"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="내용"
            name="content"
            required
            multiline
            rows={10}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <input type="file" accept="image/*" style={{ display: "none" }} />
            <Button variant="outlined">썸네일 업로드</Button>
            <Box sx={{ mt: 2 }}>
              <img
                alt="Thumbnail preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </Box>
          </Box>

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
