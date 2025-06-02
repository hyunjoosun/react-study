"use client";

import { Box, Button, Container, Pagination, Typography } from "@mui/material";
import React, { useState } from "react";
import Category from "./list/category";
import Items from "./list/item";

export default function BoardPage() {
  const [page, setPage] = useState(1);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">게시판</Typography>
        <Button variant="contained" href="./write">
          글쓰기
        </Button>
      </Box>

      <Category />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Items page={page} />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination
          color="primary"
          page={page}
          count={5}
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
}
