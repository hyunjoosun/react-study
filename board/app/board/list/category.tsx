"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  IconButton,
  SelectChangeEvent,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [categories, setCategories] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(search);
  const [selectedCategory, setSelectedCategory] = useState(category);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("posts").select("category");

      if (error) {
        console.error("카테고리 로딩 오류:", error.message);
        return;
      }

      const uniqueCategories = Array.from(
        new Set(data.map((post) => post.category).filter(Boolean))
      );

      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    onCategoryChange(selectedCategory);
    onSearch(inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  const handleSearchClick = () => handleSearch();

  return (
    <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>카테고리</InputLabel>
        <Select
          label="카테고리"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
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
