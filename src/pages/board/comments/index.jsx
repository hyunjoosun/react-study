import React from "react";
import CommentForm from "./comments-form";
import CommentList from "./comments-list";
import "./comments.css";

export default function Comment() {
  return (
    <div className="comment_box">
      <CommentForm />
      <CommentList />
    </div>
  );
}
