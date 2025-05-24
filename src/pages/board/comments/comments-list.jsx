import {useState} from "react";
import Reply from "./reply";
import ReplyComment from "./reply_list";
import "./comments.css";

export default function CommentList({comments, boardUser, onReplySubmit}) {
    const [replyWrap, setReplyWrap] = useState("");

    const handleReply = (idx) => {
        setReplyWrap(replyWrap === idx ? null : idx );
    };

  return (
    <div className="comment_list">
        <ul>
            {comments.map((comment,idx) => (
                <li key={idx}>
                    <div className="comment_item">
                        <div className="top">
                            <div className="name">{comment.userId}</div>
                            {comment.userId === boardUser && (
                                <div className="btn_box">
                                    <button className="btn" onClick={() => {handleReply(idx)}}>답글</button>
                                    {comment.userId === boardUser && (
                                        <>
                                            <button className="btn">수정</button>
                                            <button className="btn">삭제</button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="txt_box">
                            {comment.content}
                        </div>

                        {replyWrap === idx && (
                             <Reply
                                boardUser={boardUser}
                                onSubmit={(reply) => {
                                    onReplySubmit(idx, reply);
                                    setReplyWrap(null);
                                }}
                           />
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                             <ReplyComment replies={comment.replies} boardUser={boardUser} />
                        )}
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
}

