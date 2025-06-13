"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useUser } from "@supabase/auth-helpers-react";
import { List as ListIcon } from "@mui/icons-material";
import { useState } from "react";

import Comment from "./comment";
import BoardTop from "../../board-top";
import RightCount from "./right-count";
import { useBoardView } from "../../../hook/boardView";

export default function PostDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  const user = useUser();
  const [commentCount, setCommentCount] = useState<number>(0);

  const { post, username } = useBoardView(numId);

  const handleCommentCountChange = (count: number) => {
    setCommentCount(count);
  };

  if (!post) return <div>로딩 중...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoardTop />

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Chip size="small" sx={{ mb: 2 }} label={post.category} />
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              작성자: {username} | 작성일:{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </Typography>

            <RightCount
              post={post}
              userId={user?.id}
              commentCount={commentCount}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {post.thumbnail && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.thumbnail}
              alt="게시글 이미지"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Comment
          postId={numId}
          commentCount={commentCount}
          onCommentCountChange={handleCommentCountChange}
        />

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
          {user?.id === post.author_id && (
            <Button variant="outlined" href={`/board/edit/${post.id}`}>
              수정
            </Button>
          )}

          <Button variant="contained" startIcon={<ListIcon />} href="/board">
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
