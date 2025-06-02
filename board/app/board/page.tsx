"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import React, { useState } from "react";
import Category from "./list/category";
import Items from "./list/item";

export default function BoardPage() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">게시판</Typography>
        <Button variant="contained" href="../board/write">
          글쓰기
        </Button>
      </Box>

      <Category
        category={category}
        search={search}
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearchChange}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Items category={category} search={search} onTotalChange={setTotalPage} page={page} onPageChange={setPage} totalPage={totalPage}/>
      </Box>
    </Container>
  );
}
