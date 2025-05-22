import React from "react";
import { Outlet } from "react-router-dom";
import "./board.css";

function Board() {
  return (
    <div className="board_wrap">
      <div className="header">
        <h2>게시판</h2>
      </div>
      <div className="board_conts">
        <Outlet />
      </div>
    </div>
  );
}

export default Board;
