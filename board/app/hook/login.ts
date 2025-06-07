import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";

export function useLogin() {
    const [errorMsg, setErrorMsg] = useState("");
  
    const login = async (email: string, password: string) => {
      const hashedPassword = CryptoJS.SHA256(password).toString();
      console.log("해시된 비밀번호:", hashedPassword);
  
      const { data: user, error } = await supabase
        .from("login")
        .select("*")
        .eq("email", email)
        .eq("password", hashedPassword)
        .maybeSingle();
  
      if (error) {
        console.error("Supabase 오류:", error);
        return false;
      }
  
      if (user && user.password === hashedPassword) {
        console.log("로그인 성공");
        return true;
      } else {
        console.log("로그인 실패");
        return false;
      }
    };
  
    return { login, errorMsg, setErrorMsg };
  }
  