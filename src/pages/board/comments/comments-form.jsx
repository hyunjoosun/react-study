import React from "react";
import "./comments.css";

export default function CommentForm() {
  return (
    <form className="comment_input">
        <textarea rows="3" placeholder="댓글을 입력해 주세요."/>
        <button>등록</button>
    </form>
  );
}

