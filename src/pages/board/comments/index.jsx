import React from "react";
import CommentForm from "./comments-form";
import CommentList from "./comments-list";
import "./comments.css";

export default function Comment({comments, boardUser, onAddComment, handleAddReply}) {
  return (
    <div className="comment_box">
      <CommentForm boardUser={boardUser} onAddComment={onAddComment} />
      <CommentList comments={comments} boardUser={boardUser} onReplySubmit={handleAddReply}/>
    </div>
  );
}
