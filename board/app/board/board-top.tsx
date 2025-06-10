"use client";

import { Box, Button, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BoardTop() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAdmin(user.email === "admin@example.com");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
      <Typography variant="h4">게시판</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        {isAdmin ? (
          <IconButton
            color="primary"
            href="/users"
            aria-label="유저 목록"
            size="large"
          >
            <PeopleIcon fontSize="inherit" />
          </IconButton>
        ) : (
          <IconButton
            color="primary"
            href="/users/mypage"
            aria-label="마이페이지"
            size="large"
          >
            <AccountCircleIcon fontSize="inherit" />
          </IconButton>
        )}
        <Button variant="outlined" href="/board/write">
          글쓰기
        </Button>
        <Button variant="outlined" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>
    </Box>
  );
}
