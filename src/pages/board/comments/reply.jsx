import { useState } from "react";
import "./comments.css";

export default function Reply({ boardUser, onSubmit }) {
  const [reply, setReply] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    const newReply = {
      userId: boardUser,
      content: reply,
    };

    onSubmit(newReply);
    setReply("");
  };

  return (
    <form className="reply_form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        placeholder="답글을 작성해 주세요."
        value={reply}
        onChange={(e) => setReply(e.target.value)}
      />
      <button className="btn">작성</button>
    </form>
  );
}
