import React, { useState, useEffect } from "react";
import axios from "axios";
import BoardItem from "./board-item";
import "./board.css";

export default function BoardList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setData(response.data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="board_list">
        <ul>
          <li className="top">
            <div className="link">
              <p>제목</p>
              <p>아이디</p>
              <p>사용자</p>
            </div>
          </li>
          {data.map((article) => (
            <BoardItem key={article.id} article={article} />
          ))}
        </ul>
      </div>
    </>
  );
}
