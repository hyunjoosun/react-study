import { useState } from "react";

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
