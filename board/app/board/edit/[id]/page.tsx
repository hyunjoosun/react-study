import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useBoardEdit } from "../../../hook/boardEdit";

const categories = ["공지사항", "정보", "일반", "질문"];

export default function EditPostPage() {
  const {
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    thumbnail,
    loading,
    handleThumbnailChange,
    handleThumbnailDelete,
    handleCancel,
    handleSubmit,
  } = useBoardEdit();

  if (loading) return <Typography>불러오는 중...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        게시글 수정
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* 카테고리 셀렉트 */}
        <FormControl fullWidth>
          <InputLabel id="category-label">카테고리</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="카테고리"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <TextField
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={6}
        />

        {/* 썸네일 미리보기 */}
        {thumbnail && (
          <Box sx={{ textAlign: "center" }}>
            <img
              src={thumbnail}
              alt="썸네일 미리보기"
              style={{ maxWidth: "100%", marginTop: "1rem" }}
            />
            <Button color="error" onClick={handleThumbnailDelete}>
              썸네일 삭제
            </Button>
          </Box>
        )}

        <Button variant="outlined" component="label">
          썸네일 이미지 업로드
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </Button>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={handleCancel}>
            취소
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            수정 완료
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
