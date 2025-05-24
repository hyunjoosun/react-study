import React from "react";
import Reply from "./reply";
import "./comments.css";

export default function CommentList() {
  return (
    <div className="comment_list">
        <ul>
            <li>
                <div className="comment_item">
                    <div className="top">
                        <div className="name">작성자</div>
                        <div className="btn_box">
                            <button className="btn">답글</button>
                            <button className="btn">수정</button>
                            <button className="btn">삭제</button>
                        </div>
                    </div>
                    <div className="txt_box">
                        댓글 내용 나옴
                    </div>
                    <Reply />
                </div>
            </li>
        </ul>
    </div>
  );
}

