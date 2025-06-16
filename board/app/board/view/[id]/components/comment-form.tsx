import { Box, Button, TextField } from "@mui/material";
import { useCommentForm } from "../../../../hook/boardView";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
}

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const { content, setContent, handleSubmit } = useCommentForm(
    postId,
    onCommentAdded
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="댓글 작성"
        multiline
        minRows={3}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        댓글 등록
      </Button>
    </Box>
  );
}
