"use client";

import { Box, Button, Container, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; 
import React, { useState } from "react";
import Category from "./list/category";
import Items from "./list/item";

export default function BoardPage() {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [totalPage, setTotalPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">게시판</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="primary"
            href="../users/mypage"
            aria-label="마이페이지"
            size="large"
          >
            <AccountCircleIcon fontSize="inherit" />
          </IconButton>
          <Button variant="outlined" href="/board/write">
            글쓰기
          </Button> 
          <Button variant="contained" href="/login">
            로그아웃
          </Button>
        </Box>
      </Box>

      <Category
        category={category}
        search={search}
        onCategoryChange={setCategory}
        onSearch={setSearch}
      />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Items category={category} search={search} onTotalChange={setTotalPage} page={page} onPageChange={setPage} totalPage={totalPage}/>
      </Box>
    </Container>
  );
}
