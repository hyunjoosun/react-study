"use client";

import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import Category from "./list/category";
import Items from "./list/item";
import BoardTop from "./board-top";

export default function BoardPage() {
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const handleTotalChange = (count: number) => {
    setTotalCount(count);
    setTotalPage(Math.ceil(count / 10));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoardTop />

      <Category
        category={category}
        search={search}
        onCategoryChange={setCategory}
        onSearch={setSearch}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Items
          page={page}
          category={category}
          search={search}
          onTotalChange={handleTotalChange}
          onPageChange={handlePageChange}
          totalPage={totalPage}
        />
      </Box>
    </Container>
  );
}
