import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./board.css";

export default function BoardView({}) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => {
        setArticle(res.data);
      });
  }, [id]);

  if (!article) return <p>불러오는 중...</p>;

  return (
    <div className="board_view">
      <h2>게시글 상세</h2>
      <div>
        <strong>제목:</strong> {article.title}
      </div>
      <div>
        <strong>작성자 ID:</strong> {article.userId}
      </div>
      <div>
        <strong>내용:</strong> {article.body}
      </div>
    </div>
  );
}
