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
import { supabase } from "@/lib/supabaseClient";

interface ExtendedAuthUser extends AuthUser {
  nickname?: string;
  post_count?: number;
  comment_count?: number;
}

export default function MyPage() {
  const [userProfile, setUserProfile] = useState<ExtendedAuthUser | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserProfile(user);
      setNickname(user.nickname || "");
      fetchUserCounts(user.id);
    }
  }, []);

  const fetchUserCounts = async (userId: string) => {
    try {
      const { count: postCount } = await supabase
        .from("post")
        .select("id", { count: "exact", head: true })
        .eq("author_id", userId);

      const { count: commentCount } = await supabase
        .from("comment")
        .select("id", { count: "exact", head: true })
        .eq("author_id", userId);

      setUserProfile((prev) =>
        prev
          ? {
              ...prev,
              post_count: postCount || 0,
              comment_count: commentCount || 0,
            }
          : null
      );
    } catch (error) {
      console.error("사용자 통계 조회 실패:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("authUser");
      router.push("/login");
    } catch (err) {
      console.error("로그아웃 중 오류 발생:", err);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const handleSaveNickname = async () => {
    if (!userProfile || !nickname.trim()) return;

    try {
      const { error } = await supabase
        .from("users")
        .update({ nickname: nickname.trim() })
        .eq("id", userProfile.id);

      if (error) throw error;

      const updatedUser: ExtendedAuthUser = {
        ...userProfile,
        nickname: nickname.trim(),
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setUserProfile(updatedUser);
      setIsEditingNickname(false);
    } catch (error) {
      console.error("닉네임 업데이트 실패:", error);
      alert("닉네임 업데이트에 실패했습니다.");
    }
  };

  if (!userProfile) {
    return <Typography>로딩 중...</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          마이페이지
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {userProfile.nickname?.charAt(0) ??
              userProfile.username?.charAt(0) ??
              "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">{userProfile.username}</Typography>
            <Typography color="text.secondary">{userProfile.email}</Typography>

            {isEditingNickname ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="닉네임"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  size="small"
                  sx={{ width: "200px", mb: 1 }}
                  helperText="닉네임은 댓글 작성시 표시됩니다"
                />
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditingNickname(false);
                      setNickname(userProfile.nickname || "");
                    }}
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveNickname}
                    size="small"
                  >
                    저장
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography color="text.secondary">
                  닉네임: {userProfile.nickname || "미설정"}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setIsEditingNickname(true)}
                  variant="outlined"
                >
                  {userProfile.nickname ? "수정" : "설정"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
            <Typography variant="h6">{userProfile.post_count || 0}</Typography>
            <Typography color="text.secondary">게시글</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
            <Typography variant="h6">
              {userProfile.comment_count || 0}
            </Typography>
            <Typography color="text.secondary">댓글</Typography>
          </Paper>
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
