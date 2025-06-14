import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { BoardWriteForm } from "../types";

export const useBoardWrite = () => {
  const router = useRouter();
  const user = useUser();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BoardWriteForm>({
    defaultValues: {
      category: "",
      title: "",
      content: "",
      thumbnail: null,
    },
  });

  const onSubmit = async (data: BoardWriteForm) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);

    try {
      let thumbnailUrl = null;

      if (data.thumbnail && data.thumbnail.length > 0) {
        const file = data.thumbnail[0];
        const safeFileName = file.name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\w.-]/g, "_");
        const filePath = `public/${Date.now()}-${safeFileName}`;

        const { data: storageData, error: uploadError } = await supabase.storage
          .from("thumbnail")
          .upload(filePath, file);

        if (uploadError) {
          throw new Error("썸네일 업로드 중 오류가 발생했습니다.");
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("thumbnail").getPublicUrl(storageData.path);

        thumbnailUrl = publicUrl;
      }

      const { error } = await supabase.from("posts").insert({
        title: data.title,
        content: data.content,
        category: data.category,
        thumbnail: thumbnailUrl,
        author_id: user.id,
      });

      if (error) {
        throw new Error("글 등록 중 오류가 발생했습니다.");
      }

      alert("글이 성공적으로 등록되었습니다.");
      router.push("/board");
    } catch (error) {
      alert(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
  };
};
