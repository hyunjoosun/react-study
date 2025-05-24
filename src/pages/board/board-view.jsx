import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./board.css";
import Login from "./login/login-form";
import Comment from "./comments/index";

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

  console.log(id);

  return (
    <div className="board_view">
      <h3>{article.title}</h3>
      <div className="name">
        작성자 <strong>{article.userId}</strong>
      </div>
      <div className="conts">
        {article.body}

        <div className="comment_wrap">
          <h4>댓글</h4>
          <Login />
          <Comment />
        </div>
      </div>
    </div>
  );
}
