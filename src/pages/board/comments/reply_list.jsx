import React from "react";
import "./comments.css";

export default function ReplyComment({ replies, boardUser }) {
  return (
    <div className="comment_list">
        <ul>
            {replies.map((reply, rIdx) => (
                <li key={rIdx}>
                    <div className="comment_item">
                        <div className="top">
                        <div className="name">{reply.userId}</div>
                        {reply.userId === boardUser && (
                            <div className="btn_box">
                            <button className="btn">수정</button>
                            <button className="btn">삭제</button>
                            </div>
                        )}
                        </div>
                        <div className="txt_box">{reply.content}</div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
}

