"use client";

import { Box, Button, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; 
import React from "react";

export default function BoardTop() {

  return (
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
  );
}
