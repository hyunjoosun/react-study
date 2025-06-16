import { Box, Typography } from "@mui/material";

interface PostContentProps {
  content: string;
  thumbnail?: string;
}

export default function PostContent({ content, thumbnail }: PostContentProps) {
  return (
    <>
      {thumbnail && (
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <img
            src={thumbnail}
            alt="게시글 이미지"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>
      )}

      <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
        {content}
      </Typography>
    </>
  );
} 