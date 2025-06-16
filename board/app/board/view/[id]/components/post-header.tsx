import { Box, Chip, Typography } from "@mui/material";
import RightCount from "./right-count";

interface PostHeaderProps {
  post: {
    id: string;
    title: string;
    category: string;
    created_at: string;
    author_id: string;
    view_count: number;
    like_count: number;
  };
  username: string | null;
  commentCount: number;
}

export default function PostHeader({ post, username, commentCount }: PostHeaderProps) {
  return (
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
          commentCount={commentCount}
        />
      </Box>
    </Box>
  );
} 