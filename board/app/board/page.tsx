"use client";

import { Box, Container } from "@mui/material";
import Category from "./list/category";
import Items from "./list/item";
import BoardTop from "./board-top";

export default function BoardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoardTop />

      <Category />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Items />
      </Box>
    </Container>
  );
}
