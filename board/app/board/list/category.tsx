"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
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
  // 내부 상태로 카테고리와 검색어 따로 관리
  const [localCategory, setLocalCategory] = useState(category);
  const [inputValue, setInputValue] = useState(search);

  // 부모가 바꿀 때 내부 상태 동기화
  useEffect(() => {
    setLocalCategory(category);
  }, [category]);

  useEffect(() => {
    setInputValue(search);
  }, [search]);

  // 카테고리 선택 시 바로 부모 콜백 호출 안함
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setLocalCategory(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // 엔터 또는 검색 버튼 클릭 시에만 부모 콜백 호출
  const handleSearch = () => {
    onCategoryChange(localCategory);
    onSearch(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select value={localCategory} label="카테고리" onChange={handleCategoryChange}>
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
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearchClick} edge="end">
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </Box>
  );
}
