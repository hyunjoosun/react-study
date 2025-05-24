import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./board.css";
import Login from "./login/login-form";
import Comment from "./comments/index";

const commentData = [
  {
    userId : "123", 
    content: "댓글입니다1",
    replies: [
      {
        userId : "123", 
        content: "대댓글입니다1",
      }
    ]
  },
  {
    userId : "456", 
    content: "댓글입니다2",
    replies: [
      {
        userId : "123", 
        content: "대댓글입니다2",
      }
    ]
  },
];


export default function BoardView({}) {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [boardUser, setBoardUser] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => {
        setArticle(res.data);
      });
  }, [id]);

  const handleAddComment = (newComment) => {
    setComments([...comments, { ...newComment, replies: [] }]);
  };

  const handleAddReply = (commentIndex, reply) => {
    const updated = [...comments];
    updated[commentIndex].replies.push(reply);
    setComments(updated);
  };


  console.log(id);

  return (
    <div className="board_view">
      {article ? (
        <>
          <h3>{article.title}</h3>
          <div className="name">
            작성자 <strong>{article.userId}</strong>
          </div>
          <div className="conts">
            {article.body}

            <div className="comment_wrap">
              <h4>댓글</h4>
              <Login boardUser={boardUser} setBoardUser={setBoardUser} />
              <Comment boardUser={boardUser} comments={comments} onAddComment={handleAddComment} handleAddReply={handleAddReply} />
            </div>
          </div>
        </>
        ) : (
          <p>게시글을 불러오는 중입니다...</p> 
        )
      }
    </div>
  );
}
