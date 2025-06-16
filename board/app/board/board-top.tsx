"use client";

import { Box, Button, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleIcon from "@mui/icons-material/People";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// @review 컴포넌트는 디렉토리를 components로 만들어서 사용하는게 좀 더 명확하게 보일듯 _를 사용허거나
export default function BoardTop() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const storedProfile = sessionStorage.getItem("userProfile");
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setIsAdmin(profile.email === "admin@example.com");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userProfile");
    document.cookie =
      "authUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
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
