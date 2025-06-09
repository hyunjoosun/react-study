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

interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
  post_count: number;
  comment_count: number;
  nickname?: string;
  title?: string;
}

const ITEMS_PER_PAGE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) throw usersError;

      const usersWithCounts = await Promise.all(
        usersData.map(async (user) => {
          const { count: postCount } = await supabase
            .from("post")
            .select("id", { count: "exact", head: true })
            .eq("author_id", user.id);

          const { count: commentCount } = await supabase
            .from("comment")
            .select("id", { count: "exact", head: true })
            .eq("author_id", user.id);

          return {
            ...user,
            post_count: postCount || 0,
            comment_count: commentCount || 0,
          };
        })
      );

      setUsers(usersWithCounts);
      setFiltered(usersWithCounts);
    } catch (err) {
      console.error("사용자 목록 불러오기 오류:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // Subscribe to comment changes
    const commentSubscription = supabase
      .channel('comment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment'
        },
        () => {
          // Refetch users data when comments change
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      commentSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loweredSearch = search.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.email.toLowerCase().includes(loweredSearch) ||
        user.username.toLowerCase().includes(loweredSearch) ||
        (user.nickname && user.nickname.toLowerCase().includes(loweredSearch))
    );
    setFiltered(filteredUsers);
  }, [search, users]);

  if (loading) return <Typography>사용자 목록을 불러오는 중...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPageUsers = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4">
              사용자 목록
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="이메일, 사용자명 또는 닉네임으로 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
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
              sx={{ minWidth: '100px' }}
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
                  display: 'flex', 
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}
                onClick={() => handleUserClick(user)}
              >
                <Avatar 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    mr: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {user.nickname?.charAt(0) ?? user.username?.charAt(0) ?? 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                    {user.nickname && ` · 닉네임: ${user.nickname}`}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  게시글 {user.post_count} · 댓글 {user.comment_count}
                </Typography>
              </Box>
              <Divider />
            </Box>
          ))}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          py: 3,
          gap: 2 
        }}>
          <Pagination
            count={Math.max(1, totalPages)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Paper>

      <Dialog
        open={!!selectedUser}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                사용자 정보
                <IconButton onClick={handleClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    bgcolor: 'primary.main'
                  }}
                >
                  {selectedUser.nickname?.charAt(0) ?? selectedUser.username?.charAt(0) ?? 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.username}</Typography>
                  <Typography color="text.secondary">{selectedUser.email}</Typography>
                  {selectedUser.nickname && (
                    <Typography variant="body1">
                      닉네임: {selectedUser.nickname}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  가입일: {format(new Date(selectedUser.created_at), "yyyy년 MM월 dd일")}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{selectedUser.post_count}</Typography>
                  <Typography color="text.secondary">게시글</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                  <Typography variant="h6">{selectedUser.comment_count}</Typography>
                  <Typography color="text.secondary">댓글</Typography>
                </Paper>
              </Box>

              {selectedUser.title && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1">
                    상태 메시지: {selectedUser.title}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
