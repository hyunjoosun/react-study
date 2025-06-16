"use client";

import {
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useMypage } from "../../hook/mypage";

export default function MyPage() {
  const router = useRouter();
  const {
    userProfile,
    loading,
    isEditingUsername,
    username,
    setUsername,
    setIsEditingUsername,
    handleLogout,
    handleSaveUsername,
  } = useMypage();

  if (loading)
    return <Typography sx={{ mt: 4, textAlign: "center" }}>로딩중</Typography>;

  // @review 미들웨어에서 해당 회원 없으면 자동으로 login 페이지로 보내고있음
  if (!userProfile)
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>
        사용자 정보를 불러올 수 없습니다.
      </Typography>
    );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          마이페이지
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          로그아웃
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3, fontSize: 40 }}>
            {userProfile.username?.charAt(0) ?? "U"}
          </Avatar>
          <Box>
            <Typography variant="h5">{userProfile.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              이메일: {userProfile.email || "알 수 없음"}
            </Typography>

            {isEditingUsername ? (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="닉네임"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  sx={{ width: 200, mb: 1 }}
                  helperText="닉네임은 댓글 작성 시 표시됩니다"
                />
                <Box sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditingUsername(false);
                      setUsername(userProfile.username || "");
                    }}
                    sx={{ mr: 1 }}
                    size="small"
                  >
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveUsername}
                    size="small"
                  >
                    저장
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography color="text.secondary">
                  닉네임: {userProfile.username || "미설정"}
                </Typography>
                <Button
                  size="small"
                  onClick={() => setIsEditingUsername(true)}
                  variant="outlined"
                >
                  {userProfile.username ? "수정" : "설정"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {/* @review 로그인 세션에 포스트 카운트나 코멘트 카운트는 존재하지 않아서 해당기능 슈퍼베이스에서 가져오는 코드 필요 */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
            <Typography variant="h6">{userProfile.post_count || 0}</Typography>
            <Typography color="text.secondary">게시글</Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1, textAlign: "center" }}>
            <Typography variant="h6">
              {userProfile.comment_count || 0}
            </Typography>
            <Typography color="text.secondary">댓글</Typography>
          </Paper>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          가입일: {format(new Date(userProfile.created_at), "yyyy년 MM월 dd일")}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => router.push("/board")}>
            게시판으로 돌아가기
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
