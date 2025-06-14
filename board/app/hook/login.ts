"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";

export type FormValues = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setErrorMsg(null);

    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setErrorMsg("유저 정보를 가져오는 데 실패했습니다.");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      setErrorMsg("프로필 정보를 불러오는 데 실패했습니다.");
      return;
    }

    document.cookie = `authUser=${user.id}; path=/`;
    sessionStorage.setItem("userProfile", JSON.stringify(profile));
    alert("로그인 성공!");
    router.push("/board");
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    setShowPassword,
    errorMsg,
  };
};
