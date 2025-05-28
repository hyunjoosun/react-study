"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import page from "app/page";

export default function BoardPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">게시판</Typography>
        <Button variant="contained" href="./write">
          글쓰기
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>카테고리</InputLabel>
          <Select label="카테고리">
            <MenuItem value="all">전체</MenuItem>
            <MenuItem value="일반">일반</MenuItem>
            <MenuItem value="공지사항">공지사항</MenuItem>
            <MenuItem value="질문">질문</MenuItem>
            <MenuItem value="정보">정보</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          placeholder="검색어를 입력하세요"
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Card sx={{ display: "flex", height: 200 }}>
          <CardMedia component="img" sx={{ width: 200 }} />
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ mb: 1 }}>
              <Chip size="small" sx={{ mr: 1 }} />
            </Box>
            <Typography
              variant="h6"
              component="a"
              href={`./view`}
              sx={{
                textDecoration: "none",
                color: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              타이틀
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              컨텐츠
            </Typography>
            <Box sx={{ mt: "auto" }}>
              <Typography variant="body2" color="text.secondary">
                작성자: _ | 작성일: _
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <VisibilityIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    10
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CommentIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    57
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FavoriteIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    7
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Pagination color="primary" />
      </Box>
    </Container>
  );
}
