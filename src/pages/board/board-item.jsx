import React from "react";
import { useNavigate } from "react-router-dom";
import "./board.css";

export default function BoardItem({ article }) {
  const { title, userId, id } = article;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/board/${id}`);
  };

  return (
    <li>
      <button onClick={handleClick} className="link">
        <p>{title}</p>
        <p>{id}</p>
        <p>{userId}</p>
      </button>
    </li>
  );
}
