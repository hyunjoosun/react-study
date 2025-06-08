"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { AuthUser } from "../../hook/auth";

export default function MyPage() {
  const [userProfile, setUserProfile] = useState<AuthUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const user: AuthUser = JSON.parse(storedUser);
    setUserProfile(user);
    setNewUsername(user.username || "");
  }, [router]);

  const handleSave = () => {
    if (!userProfile) return;

    const updatedUser = { ...userProfile, username: newUsername };
    setUserProfile(updatedUser);
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  if (!userProfile) return <p>로딩 중...</p>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {userProfile.username?.charAt(0) ?? "U"}
          </Avatar>
          <Box>
            {isEditing ? (
              <>
                <TextField
                  label="새 사용자 이름"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box>
                  <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                    취소
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    저장
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h5">{userProfile.username}</Typography>
                <Typography color="text.secondary">{userProfile.email}</Typography>
                <Button size="small" onClick={() => setIsEditing(true)} sx={{ mt: 1 }}>
                  수정
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          {userProfile.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          가입일: {format(new Date(userProfile.created_at), "yyyy년 MM월 dd일")}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => router.push("/board")}>
            게시판으로 돌아가기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
