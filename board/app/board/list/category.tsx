"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";

export default function Category() {
  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select label="카테고리">
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value="일반">일반</MenuItem>
          <MenuItem value="공지사항">공지사항</MenuItem>
          <MenuItem value="질문">질문</MenuItem>
          <MenuItem value="정보">정보</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        placeholder="검색어를 입력하세요"
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
      />
    </Box>
  );
}
