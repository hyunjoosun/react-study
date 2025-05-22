import React from "react";
import { useNavigate } from "react-router-dom";
import "./board.css";

export default function BoardItem({ article }) {
  const { title, userId, id } = article;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${article.id}`);
  };

  return (
    <li>
      <button onClick={handleClick} className="link">
        <p>{article.title}</p>
        <p>{article.id}</p>
        <p>{article.userId}</p>
      </button>
    </li>
  );
}
