"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type FormValues = {
  email: string;
  password: string;
};

export const useBoardList = () => {
  const [page, setPage] = useState<number>(1);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    page,
    category,
    setCategory,
    search,
    setSearch,
    handlePageChange,
  };
};

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
