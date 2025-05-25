import {useState} from "react";
import Reply from "./reply";
import ReplyComment from "./reply_list";
import "./comments.css";

export default function CommentList({
    comments,
    boardUser,
    onEditReply,
    onDeleteReply,
    onEditComment,
    onDeleteComment,
    onAddReply,
}) {
    const [replyWrap, setReplyWrap] = useState("");
    const [commentModify, setCommentModify] = useState("");
    const [commentDelete, setCommentDelete] = useState("");

    const handleReply = (idx) => {
        setReplyWrap(replyWrap === idx ? null : idx );
    };

    const handleModify = (idx, content) => {
        setCommentModify(idx);
        setCommentDelete(content);
    };
    const handleModifySave = (idx) => {
        if(commentDelete.trim()){
            onEditComment(idx, commentDelete);
            setCommentModify(null);
            setCommentDelete("");
        };
    };

    const handleReplySubmit = (newReply) => {
        if (replyWrap !== null) {
          onAddReply(replyWrap, newReply);
          setReplyWrap(null);
        }
    };

  return (
    <div className="comment_list">
        <ul>
            {comments.map((comment,idx) => (
                <li key={idx}>
                    <div className="comment_item">
                        <div className="top">
                            <div className="name">{comment.userId}</div>
                                <div className="btn_box">
                                    <button className="btn" onClick={() => {handleReply(idx)}}>답글</button>
                                    {comment.userId === boardUser && (
                                        <>
                                            <button className="btn" onClick={() => handleModify(idx, comment.content)}>수정</button>
                                            <button className="btn" onClick={() => onDeleteComment(idx)}>삭제</button>
                                        </>
                                    )}
                                </div>
                        </div>
                        <div className="txt_box">
                            {commentModify === idx ? (
                                <form className="reply_form" onSubmit={(e) => {e.preventDefault(); handleModifySave(idx);}}>
                                    <input type="text" className="input" value={commentDelete} onChange={(e) => setCommentDelete(e.target.value)}/>
                                    <button className="btn" type="submit">확인</button>
                                </form>
                            ):(
                                comment.content
                            )}
                        </div>


                        <div className="reply_wrap">
                            {replyWrap === idx && (
                                <Reply
                                    boardUser={boardUser}
                                    onSubmit={handleReplySubmit}
                                />
                            )}

                            {comment.replies && comment.replies.length > 0 && (
                                <ReplyComment 
                                    replies={comment.replies} 
                                    boardUser={boardUser} 
                                    parentIdx={idx}
                                    onEditReply={onEditReply}
                                    onDeleteReply={onDeleteReply}
                                />
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
  );
}

