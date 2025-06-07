import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SelectChangeEvent } from "@mui/material";

interface UseBoardProps {
    category: string;
    search: string;
    onCategoryChange: (value: string) => void;
    onSearch: (value: string) => void;
  }

export function useBoard({
    category,
    search,
    onCategoryChange,
    onSearch,
  }: UseBoardProps) {
    const [localCategory, setLocalCategory] = useState<string>(category);
    const [inputValue, setInputValue] = useState<string>(search);
    const [categories, setCategories] = useState<string[]>([]);
  
    useEffect(() => {
      setLocalCategory(category);
    }, [category]);
  
    useEffect(() => {
      setInputValue(search);
    }, [search]);
  
    //슈퍼베이스 카테고리 불러오기
    useEffect(() => {
      async function fetchCategories() {
        const { data, error } = await supabase
          .from("post")
          .select("category");
  
          if (error) {
            console.error(error);
            return;
          }
      
          if (data) {
            const uniqueCategories = Array.from(new Set(data.map((item) => item.category)));
            setCategories(uniqueCategories);
          }
      }
      fetchCategories();
    }, []);
  
    const handleCategoryChange = (event: SelectChangeEvent) => {
      setLocalCategory(event.target.value);
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
  
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
  
    return { localCategory,
        inputValue,
        categories,
        handleCategoryChange,
        handleInputChange,
        handleKeyDown,
        handleSearchClick, };
  }
  