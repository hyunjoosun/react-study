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

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("users").select(`
        *,
        post_count:post(count),
        comment_count:comment(count)
      `);

    if (error) {
      console.error("error", error);
      setUsers([]);
    } else {
      const usersWithCounts = data.map((user) => ({
        ...user,
        post_count: user.post_count || 0,
        comment_count: user.comment_count || 0,
      }));
      setUsers(usersWithCounts);
      setFiltered(usersWithCounts);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const results = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
    setFiltered(results);
  }, [search, users]);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름 또는 이메일로 검색"
          sx={{ mb: 3 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filtered.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserClick(user)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.avatar_url || undefined}>
                    {user.username?.charAt(0) ?? "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.username || "이름 없음"}
                  secondary={user.email}
                />
              </ListItem>
            ))}
          </List>
        )}

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
