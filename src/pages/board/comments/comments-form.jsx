import {useState} from "react";
import "./comments.css";

export default function CommentForm({boardUser, onAddComment}) {
  const [value, setValue] = useState("");

  // useEffect(() => {
  //   const commentValue = localStorage.getItem("myValue");
  //   if(commentValue){
  //     setValue(commentValue);
  //   }
  // }, []);

  // const handleChange = (e) => {
  //   setValue(e.target.value);
  // };

  const handleSave = (e) => {
    e.preventDefault();
    // localStorage.setItem("myValue", value);
    if(!value) return;
    const newComment = {
      userId : boardUser,
      content : value,
    };
    onAddComment(newComment);
    setValue("");
  };

  return (
    <form className="comment_input" onSubmit={handleSave}>
        <textarea rows="3" placeholder="댓글을 입력해 주세요." value={value} onChange={(e) => setValue(e.target.value)}/>
        <button type="submit">등록</button>
    </form>
  );
}

