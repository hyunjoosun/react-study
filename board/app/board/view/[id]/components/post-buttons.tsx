import { Box, Button } from "@mui/material";
import { List as ListIcon } from "@mui/icons-material";

interface PostButtonsProps {
  postId: string;
  authorId: string;
  userId: string | null;
}

export default function PostButtons({ postId, authorId, userId }: PostButtonsProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
      {userId === authorId && (
        <Button variant="outlined" href={`/board/edit/${postId}`}>
          수정
        </Button>
      )}

      <Button variant="contained" startIcon={<ListIcon />} href="/board">
        목록으로
      </Button>
    </Box>
  );
} 