"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

type UserProfile = {
  id: string;
  title: string;
  email: string;
  username: string;
  created_at: string;
};

export default function MyPage() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={userProfile.avatar_url || undefined}
            alt={userProfile.username}
            sx={{ width: 80, height: 80, mr: 3 }}
          >
            {userProfile.username?.charAt(0) ?? "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">{userProfile.username}</Typography>
            <Typography color="text.secondary">{userProfile.email}</Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          직함: {userProfile.title || "일반 사용자"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          가입일: {format(new Date(userProfile.created_at), "yyyy년 MM월 dd일")}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" href="/board">
            게시판으로 돌아가기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
