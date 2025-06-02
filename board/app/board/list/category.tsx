"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { Search as SearchIcon } from "@mui/icons-material";

interface CategoryProps {
  category: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function Category({
  category,
  search,
  onCategoryChange,
  onSearch,
}: CategoryProps) {
  const handleCategoryChange = (event: SelectChangeEvent) => {
    onCategoryChange(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select
          value={category}
          label="카테고리"
          onChange={handleCategoryChange}
        >
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
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: <SearchIcon />,
        }}
      />
    </Box>
  );
}
