import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// 게시판 리스트 - 카테고리
export const useCategory = (category = "all", search = "") => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category);
  const [inputValue, setInputValue] = useState<string>(search);

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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return {
    categories,
    selectedCategory,
    inputValue,
    setSelectedCategory: handleCategoryChange,
    setInputValue: handleInputChange,
  };
};
