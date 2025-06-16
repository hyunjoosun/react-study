import { Box, Button, TextField, Typography } from "@mui/material";
import { useUser } from "@supabase/auth-helpers-react";
import { useCommentList } from "../../../hook/boardView";

interface CommentListProps {
  postId: number;
}

export default function CommentList({ postId }: CommentListProps) {
  const user = useUser();
  const {
    comments,
    loading,
    commentLoading,
    editingCommentId,
    editContent,
    setEditContent,
    setEditingCommentId,
    handleEditSubmit,
    handleDelete,
  } = useCommentList(postId);

  if (loading) return <Typography variant="body2">로딩중...</Typography>;
  if (comments.length === 0)
    return <Typography variant="body2">아직 댓글이 없습니다.</Typography>;

  return (
    <>
      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2, p: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {comment.profiles?.username} |{" "}
            {new Date(comment.created_at).toLocaleString()}
          </Typography>

          {editingCommentId === comment.id ? (
            <>
              <TextField
                multiline
                minRows={3}
                fullWidth
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                disabled={commentLoading}
              />
              <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => handleEditSubmit(comment.id)}
                  disabled={commentLoading || !editContent.trim()}
                >
                  수정 완료
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditingCommentId(null)}
                  disabled={commentLoading}
                >
                  취소
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {comment.content}
              </Typography>
              {comment.author_id === user?.id && (
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditContent(comment.content);
                    }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(comment.id)}
                    disabled={commentLoading}
                  >
                    삭제
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      ))}
    </>
  );
}
