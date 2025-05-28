"use client";

import React from "react";
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
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export default function UsersPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          사용자 목록
        </Typography>

        <TextField
          fullWidth
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

        <List>
          <ListItem
            sx={{
              cursor: "pointer",
              "&:hover": { backgroundColor: "action.hover" },
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemAvatar>
              <Avatar alt="이름" />
            </ListItemAvatar>
            <ListItemText primary="이름" secondary="이메일" />
          </ListItem>
        </List>
      </Paper>
    </Container>
  );
}
