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
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

type User = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  title: string;
  created_at: string;
  post_count: number;
  comment_count: number;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // 사용자 목록 가져오기
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) throw usersError;

      // 각 사용자의 게시글 수와 댓글 수 가져오기
      const usersWithCounts = await Promise.all(
        usersData.map(async (user) => {
          // 게시글 수 가져오기
          const { count: postCount } = await supabase
            .from("post")
            .select("id", { count: "exact", head: true })
            .eq("author_id", user.id);

          // 댓글 수 가져오기
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
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, users]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            사용자 목록
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" href="/board">
              게시판
            </Button>
            <Button variant="outlined" href="/board/write">
              글쓰기
            </Button> 
            <Button variant="contained" href="/login">
              로그아웃
            </Button>
          </Box>
        </Box>
       
        <TextField
          fullWidth
          variant="outlined"
          placeholder="이메일 또는 사용자명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이메일</TableCell>
                <TableCell>사용자명</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell>게시글 수</TableCell>
                <TableCell>댓글 수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.post_count}</TableCell>
                  <TableCell>{user.comment_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={Boolean(selectedUser)}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
        >
          {selectedUser && (
            <>
              <DialogTitle>사용자 정보</DialogTitle>
              <DialogContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                    src={selectedUser.avatar_url || undefined}
                    alt={selectedUser.username}
                    sx={{ width: 80, height: 80, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {selectedUser.username}
                    </Typography>
                    <Typography color="text.secondary">
                      {selectedUser.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    {selectedUser.title || "일반 사용자"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    가입일:{" "}
                    {format(
                      new Date(selectedUser.created_at),
                      "yyyy년 MM월 dd일"
                    )}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>닫기</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Paper>
    </Container>
  );
}
