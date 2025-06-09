import { supabase } from "@/lib/supabaseClient";

interface UserData {
  username: string;
  nickname: string | null;
  title: string;
  created_at: string;
}

export async function loginWithEmailPassword(email: string, password: string) {
  try {
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

    // Get additional user data from the users table
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('username, nickname, title, created_at')
      .eq('id', data.user.id)
      .single();

    // If user data doesn't exist, create it
    if (userError && userError.message.includes("returned")) {
      const newUserData = {
        id: data.user.id,
        email: data.user.email,
        username: email.split('@')[0], // Default username from email
        nickname: null,
        title: '새로운 사용자',
        created_at: new Date().toISOString()
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single();

      if (insertError) {
        console.error("새 사용자 데이터 생성 실패:", insertError.message);
        return null;
      }

      userData = insertedData as UserData;
    } else if (userError) {
      console.error("사용자 데이터 조회 실패:", userError.message);
      return null;
    }

    if (!userData) {
      console.error("사용자 데이터가 없습니다.");
      return null;
    }

    // Combine auth user data with database user data
    const fullUserData = {
      id: data.user.id,
      email: data.user.email || '',
      username: userData.username,
      nickname: userData.nickname || null,
      title: userData.title || '',
      created_at: userData.created_at
    };

    return fullUserData;
  } catch (err) {
    console.error("로그인 중 오류 발생:", err);
    return null;
  }
}
