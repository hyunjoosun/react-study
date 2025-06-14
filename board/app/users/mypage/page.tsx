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
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { UserProfile } from "../../types";

export default function MyPage() {
  const router = useRouter();
  const user = useUser();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditingUsername, setIsEditingUsername] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        console.error("프로필 불러오기 실패:", profileError);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      const { count: postCount, error: postError } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("author_id", user.id);

      const { count: commentCount, error: commentError } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("author_id", user.id);

      if (postError || commentError) {
        console.error("카운트 불러오기 실패:", postError || commentError);
      }

      setUserProfile({
        ...profileData,
        post_count: postCount || 0,
        comment_count: commentCount || 0,
      });

      setUsername(profileData?.username || "");
      setLoading(false);
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleSaveUsername = async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username })
      .eq("id", user.id);

    if (error) {
      alert("닉네임 저장 실패: " + error.message);
      return;
    }

    setUserProfile((prev) => prev && { ...prev, username });
    setIsEditingUsername(false);
  };

  if (loading)
    return <Typography sx={{ mt: 4, textAlign: "center" }}>로딩중</Typography>;

  if (!userProfile)
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        사용자 정보를 불러올 수 없습니다.
      </Typography>
    );

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
          <Avatar sx={{ width: 80, height: 80, mr: 3, fontSize: 40 }}>
            {userProfile.username?.charAt(0) ?? "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">{userProfile.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              이메일: {user?.email || "알 수 없음"}
            </Typography>

            {isEditingUsername ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="닉네임"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  sx={{ width: 200, mb: 1 }}
                  helperText="닉네임은 댓글 작성 시 표시됩니다"
                />
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setUsername(userProfile.username || "");
                    }}
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveUsername}
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
                  닉네임: {userProfile.username || "미설정"}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setIsEditingUsername(true)}
                  variant="outlined"
                >
                  {userProfile.username ? "수정" : "설정"}
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

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
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
