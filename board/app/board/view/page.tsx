"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  List as ListIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";

export default function PostDetailPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Chip size="small" sx={{ mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            타이틀
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">작성자: _ | 작성일: _</Typography>
            <Stack direction="row" spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2">15</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CommentIcon fontSize="small" />
                <Typography variant="body2">58</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2">7</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3, textAlign: "center" }}>
          <img
            alt="게시글 이미지"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          컨텐츠
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ArrowBackIcon sx={{ mr: 1 }} />
            <Typography
              component="a"
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              이전글: 내용
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArrowForwardIcon sx={{ mr: 1 }} />
            <Typography
              component="a"
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              다음글: 내용
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" startIcon={<ListIcon />} href="/board">
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
