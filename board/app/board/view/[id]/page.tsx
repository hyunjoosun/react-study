"use client";

import { Container, Divider, Paper } from "@mui/material";
import { useParams } from "next/navigation";

import Comment from "./components/comment";
import BoardTop from "../../components/board-top";
import PostHeader from "./components/post-header";
import PostContent from "./components/post-content";
import PostButtons from "./components/post-buttons";
import { useBoardView, useUserId, useCommentCount } from "../../../hook/boardView";

export default function PostDetailPage() {
  const { id } = useParams();
  const numId = Number(id);
  
  const { post, username } = useBoardView(numId);
  const userId = useUserId();
  const { commentCount, handleCommentCountChange } = useCommentCount();

  if (!post) return <div>로딩 중...</div>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BoardTop />

      <Paper elevation={3} sx={{ p: 4 }}>
        <PostHeader
          post={post}
          username={username}
          commentCount={commentCount}
        />

        <Divider sx={{ my: 3 }} />

        <PostContent
          content={post.content}
          thumbnail={post.thumbnail}
        />

        <Divider sx={{ my: 3 }} />

        <Comment
          postId={numId}
          commentCount={commentCount}
          onCommentCountChange={handleCommentCountChange}
        />

        <Divider sx={{ my: 3 }} />

        <PostButtons
          postId={String(post.id)}
          authorId={post.author_id}
          userId={userId}
        />
      </Paper>
    </Container>
  );
}
