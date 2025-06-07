"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useBoard } from "../../hook/board";

interface CategoryProps {
  category: string;
  search: string;
  onCategoryChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function Category(
  {
    category,
    search,
    onCategoryChange,
    onSearch,
  }: CategoryProps
) {
  const {
    localCategory,
    inputValue,
    categories,
    handleCategoryChange,
    handleInputChange,
    handleKeyDown,
    handleSearchClick,
  } = useBoard({ category, search, onCategoryChange, onSearch });

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select value={localCategory} label="카테고리" onChange={handleCategoryChange}>
          <MenuItem value="all">전체</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
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
