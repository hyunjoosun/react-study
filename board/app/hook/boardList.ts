"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PostWithProfile } from "../types";

// @review boardList 안에서 사용하는 훅들을 모아둔건 좋은것같으나 훅을 3개로 분리해서 사용하는게 좀 더 깔끔할듯 추후에는 더 많은 코드들이 추가할수있어서

export type FormValues = {
  email: string;
  password: string;
};

// 게시판 리스트
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

// 게시판 리스트 - 아이템
// @review 데이터 패칭의 부분의 경우 swr를 사용하는게 error, loading, data를 관리하기가 더 편할듯 슈퍼베이스 fetch 함수 -> swr -> 컴포넌트에서 사용
export const useBoardItem = (
  category: string,
  keyword: string,
  page: number,
  itemsPerPage = 10
) => {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from("posts")
        .select(
          `
        *,
        profiles(username, name)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .order("id", { ascending: false });

      if (category !== "all") query = query.eq("category", category);
      if (keyword) query = query.ilike("title", `%${keyword}%`);

      const { data, count, error } = await query.range(from, to);

      if (error) {
        console.error("에러:", error.message);
      } else {
        setPosts(data || []);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      }
      setLoading(false);
    };

    fetchPosts();
  }, [category, keyword, page]);

  return {
    posts,
    loading,
    totalPages,
  };
};
