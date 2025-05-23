import React from "react";
import "./comments.css";

export default function Comment() {
  return (
    <div className="comment_wrap">
      <form>
        <textarea rows="5" cols="20" />
        <button>작성</button>
      </form>
    </div>
  );
}
