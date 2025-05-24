import React from "react";
import "./comments.css";

export default function Reply() {
  return (
    <div className="reply_wrap">
        <div className="reply_form">
            <input type="text" className="input" placeholder="답글을 작성해 주세요."/>
            <button className="btn">작성</button>
        </div>
        <div className="comment_list">
            <ul>
                <li>
                    <div className="comment_item">
                        <div className="top">
                            <div className="name">작성자</div>
                            <div className="btn_box">
                                <button className="btn">수정</button>
                                <button className="btn">삭제</button>
                            </div>
                        </div>
                        <div className="txt_box">
                            답글 내용 나옴
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  );
}

