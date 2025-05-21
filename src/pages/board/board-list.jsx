import React, {useState} from 'react';
import axios from "axios";
import "./board.css";

function BoardList() {
    const [post, setPost] = useState([]);

  return (
    <div className="board_inner">
        게시판 내용
    </div>
  );
}

export default BoardList;
