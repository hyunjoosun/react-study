"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import { LoginForm } from "../types";
import { hashPassword } from "./hash";

export const useLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const onSubmit = useCallback(
    async (data: LoginForm) => {
      setErrorMsg(null);

      const hashedPassword = await hashPassword(data.password);

      const { data: user, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", data.email)
        .eq("password", hashedPassword)
        .single();

      if (error || !user) {
        setErrorMsg("이메일 또는 비밀번호가 일치하지 않습니다.");
        return;
      }

      sessionStorage.setItem("userProfile", JSON.stringify(user));
      document.cookie = `authUser=${user.id}; path=/`;

      alert("로그인 성공!");
      router.push("/board");
    },
    [router]
  );

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    showPassword,
    setShowPassword: toggleShowPassword,
    errorMsg,
  };
};
