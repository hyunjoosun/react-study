import React from "react";
import "./login.css";

export default function Login() {
  return (
    <div className="login_wrap">
      <form>
        <input type="text" className="input" placeholder="아이디" />
        <input type="text" className="input" placeholder="비밀번호" />
        <button>로그인</button>
      </form>
    </div>
  );
}
