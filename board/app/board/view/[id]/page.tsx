"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; 
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  List as ListIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { supabase } from "@/lib/supabaseClient";

type PostType = {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  view_count: number;
  comment_count: number;
  like_count: number;
  image_url?: string;
};

type CommentType = {
  id: string;
  post_id: string;
  author: string;
  content: string;
  created_at: string;
};

export default function PostDetailPage() {
  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const params = useParams();
  const id = params?.id as string;

  
useEffect(() => {
  const fetchPostAndComments = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("post")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log("에러:", error);
    } else {
      setPost(data);
    }

    const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.log("댓글 불러오기 에러:", commentsError);
      } else {
        setComments(commentsData || []);
      }

    setLoading(false);
  };

  fetchPostAndComments();
}, [id]);

const handleCommentSubmit = async () => {
  if (!commentContent.trim()) {
    alert("댓글 내용을 입력하세요.");
    return;
  }

  setCommentLoading(true);

  const author = "익명";

  const { data, error } = await supabase.from("comments").insert([
    {
      post_id: id,
      author,
      content: commentContent.trim(),
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    alert("댓글 작성 실패: " + error.message);
  } else {
    setCommentContent("");
    setComments((prev) => [...prev, ...(data || [])]);
  }

  setCommentLoading(false);
};


  if (loading) return <Typography>불러오는 중...</Typography>;
  if (!post) return <Typography>게시글이 존재하지 않습니다.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Chip size="small" sx={{ mb: 2 }} label={post.category} />
          <Typography variant="h4" gutterBottom>{post.title}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="body2">
              작성일: {new Date(post.created_at).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityIcon fontSize="small" />
                <Typography variant="body2">{post.view_count}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CommentIcon fontSize="small" />
                <Typography variant="body2">{post.comment_count}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FavoriteIcon fontSize="small" />
                <Typography variant="body2">{post.like_count}</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {post.image_url && (
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <img
              src={post.image_url}
              alt="게시글 이미지"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
        )}

        <Typography variant="body1" sx={{ mb: 4, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            댓글 ({comments.length})
          </Typography>
          {comments.length === 0 && (
            <Typography color="text.secondary">등록된 댓글이 없습니다.</Typography>
          )}
          {comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {comment.author} | {new Date(comment.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body1">{comment.content}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="댓글 작성"
            multiline
            minRows={3}
            fullWidth
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            disabled={commentLoading}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            disabled={commentLoading}
          >
            댓글 등록
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Button variant="outlined" href={`/board/edit/${post.id}`}>
          수정
        </Button>

          <Button variant="contained" startIcon={<ListIcon />} href="/board">
            목록으로
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
