import { useState } from "react";
import "./comments.css";

export default function ReplyComment({ replies, boardUser, parentIdx, onEditReply, onDeleteReply }) {
    const [replyModify, setReplyModify] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const handleSave = (replyIdx) => {
      if (replyContent.trim()) {
        onEditReply(parentIdx, replyIdx, replyContent);
        setReplyModify(null);
        setReplyContent("");
      }
    };

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
                            <button className="btn" onClick={() => {
                                setReplyModify(rIdx);
                                setReplyContent(reply.content);
                                }}>수정</button>
                                <button className="btn" onClick={() => onDeleteReply(parentIdx, rIdx)}>삭제</button>
                            </div>
                        )}
                        </div>
                        <div className="txt_box">
                            {replyModify === rIdx ? (
                            <form className="reply_form" onSubmit={(e) => { e.preventDefault(); handleSave(rIdx); }}>
                                <input
                                type="text"
                                className="input"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <button className="btn" type="submit">확인</button>
                            </form>
                            ) : (
                            reply.content
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
}

