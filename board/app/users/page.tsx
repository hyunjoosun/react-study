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
  CircularProgress
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

type User = {
  id: string;
  email: string;
  username: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("id, email, username");

    if (error) {
      console.error("error", error);
      setUsers([]);
    } else {
      setUsers(data);
      setFiltered(data);
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
        <Typography variant="h4" gutterBottom>
          사용자 목록
        </Typography>

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
          <CircularProgress />
        ) : (
          <List>
            {filtered.map((user) => (
              <ListItem
                key={user.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar>
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
      </Paper>
    </Container>
  );
}
