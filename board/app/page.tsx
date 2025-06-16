"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress } from "@mui/material";

export default function Home() {
  // @review / 로 진입시 바로 로그인페이지로 보내기보다는 미들웨어에서 세션에 로그인 값에 따라서 board 나 login 페이지로 보내는게 좋을듯 불필요한 코드
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
