"use client";

import { Box, Container } from "@mui/material";
import { useBoardList } from "../hook/boardList";
import Category from "./components/category";
import Items from "./components/item";
import BoardTop from "./components/board-top";

export default function BoardPage() {
  const { page, category, setCategory, search, setSearch, handlePageChange } =
    useBoardList();

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
          keyword={search}
          onPageChange={handlePageChange}
        />
      </Box>
    </Container>
  );
}
