import { supabase } from "@/lib/supabaseClient";
import CryptoJS from "crypto-js";

export async function loginWithEmailPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("로그인 실패:", error.message);
    return null;
  }

  if (!data || !data.user) {
    console.error("로그인 실패: 사용자 데이터가 없음", data);
    return null;
  }

  return data.user;
}
