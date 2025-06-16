"use client";

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
import { useState } from "react";
import { useUsers } from "../hook/users";
import { UserProfile } from "../types";

export default function UsersPage() {
  const {
    filteredUsers,
    loading,
    error,
    searchInput,
    setSearchInput,
    handleSearch,
    page,
    setPage,
    totalPages,
  } = useUsers();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">사용자 정보를 불러오는 중입니다...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          사용자 정보를 불러오는데 실패했습니다.
        </Typography>
      </Container>
    );
  }

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
          {filteredUsers.map((user) => (
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
                  {user.username?.charAt(0) ?? "U"}
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
                  {selectedUser.username?.charAt(0) ?? "U"}
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
