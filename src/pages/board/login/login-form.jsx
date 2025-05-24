import React, { useState } from "react";
import "./login.css";

const userData = [
  {userId : "123", userPW : "123"},
  {userId : "456", userPW : "456"},
  {userId : "789", userPW : "789"},
  {userId : "1011", userPW : "1011"},
  {userId : "1213", userPW : "1213"},
];

export default function Login({boardUser, setBoardUser}) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const boardUser = userData.find((u) => u.userId === id && u.userPW === pw);
    if(boardUser){
      setBoardUser(boardUser.userId);
    };
  }; 

  const handleLogout = () => {
    setBoardUser(null);
  };

  return (
    <div className="login_wrap">
      {boardUser ? (
        <div className="logout_box">
          <strong>{boardUser}</strong>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
      <form onSubmit={handleLogin}>
        <input type="text" className="input" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)}/>
        <input type="text" className="input" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} />
        <button type="submit">로그인</button>
      </form>
      )}
    </div>
  );
}
