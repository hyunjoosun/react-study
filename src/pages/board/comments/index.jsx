import React from "react";
import CommentForm from "./comments-form";
import CommentList from "./comments-list";
import "./comments.css";

export default function Comment({
  boardUser,
  comments,
  onAddComment,
  handleAddReply,
  onEditComment,
  onDeleteComment,
  onEditReply,
  onDeleteReply,
  onAddReply,
}) {
  return (
    <div className="comment_box">
      <CommentForm boardUser={boardUser} onAddComment={onAddComment} />
      <CommentList 
        comments={comments}
        boardUser={boardUser}
        onAddReply={handleAddReply}
        onEditReply={onEditReply}
        onDeleteReply={onDeleteReply}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
      />
    </div>
  );
}
