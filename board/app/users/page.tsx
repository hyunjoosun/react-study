"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  InputAdornment,
  Button,
  Pagination,
  Divider,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";

const ITEMS_PER_PAGE = 10;

interface User {
  id: string;
  name: string;
  username: string;
  nickname?: string;
  created_at: string;
  post_count: number;
  comment_count: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentPageUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("유저 정보 불러오기 실패:", error);
      return;
    }

    const usersWithCounts = await Promise.all(
      data.map(async (user) => {
        const [{ count: postCount }, { count: commentCount }] =
          await Promise.all([
            supabase
              .from("posts")
              .select("*", { count: "exact", head: true })
              .eq("author_id", user.id),
            supabase
              .from("comments")
              .select("*", { count: "exact", head: true })
              .eq("author_id", user.id),
          ]);

        return {
          ...user,
          post_count: postCount || 0,
          comment_count: commentCount || 0,
        };
      })
    );

    setUsers(usersWithCounts);
    setFilteredUsers(usersWithCounts);
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleSearch = () => {
    const lowercasedInput = searchInput.toLowerCase();
    const filtered = users.filter((user) => {
      const name = user.name?.toLowerCase() || "";
      const username = user.username?.toLowerCase() || "";

      return (
        name.includes(lowercasedInput) || username.includes(lowercasedInput)
      );
    });
    setFilteredUsers(filtered);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4">사용자 목록</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" href="/board">
                홈
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  localStorage.removeItem("authUser");
                  window.location.href = "/login";
                }}
              >
                로그아웃
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="사용자명 또는 닉네임으로 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: "100px" }}
            >
              검색
            </Button>
          </Box>
        </Box>

        <Box>
          {currentPageUsers.map((user) => (
            <Box key={user.id}>
              <Box
                sx={{
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => handleUserClick(user)}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    bgcolor: "primary.main",
                  }}
                >
                  {user.nickname?.charAt(0) ?? user.username?.charAt(0) ?? "U"}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{user.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  게시글 {user.post_count} · 댓글 {user.comment_count}
                </Typography>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 3,
            gap: 2,
          }}
        >
          <Pagination
            count={Math.max(1, totalPages)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>

      {/* 사용자 상세 정보 모달 */}
      <Dialog
        open={!!selectedUser}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                사용자 정보
                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 3,
                    bgcolor: "primary.main",
                  }}
                >
                  {selectedUser.nickname?.charAt(0) ??
                    selectedUser.username?.charAt(0) ??
                    "U"}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="h6">
                    {selectedUser.username && (
                      <Typography variant="body1">
                        {selectedUser.username}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  가입일:{" "}
                  {format(
                    new Date(selectedUser.created_at),
                    "yyyy년 MM월 dd일"
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
                  <Typography variant="h6">
                    {selectedUser.post_count}
                  </Typography>
                  <Typography color="text.secondary">게시글</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
                  <Typography variant="h6">
                    {selectedUser.comment_count}
                  </Typography>
                  <Typography color="text.secondary">댓글</Typography>
                </Paper>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
