import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { BoardWriteForm } from "../types";

export function useBoardEdit() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);
  const [loading, setLoading] = useState<boolean>(true);
  const [defaultThumbnail, setDefaultThumbnail] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BoardWriteForm>({
    defaultValues: {
      category: "",
      title: "",
      content: "",
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("게시글 불러오기 실패:", error);
        setLoading(false);
        return;
      }

      reset({
        category: data.category,
        title: data.title,
        content: data.content,
        thumbnail: null,
      });
      setDefaultThumbnail(data.thumbnail);
      setLoading(false);
    };

    fetchPost();
  }, [id, reset]);

  const onSubmit = async (data: BoardWriteForm) => {
    const userProfile = sessionStorage.getItem("userProfile");
    if (!userProfile) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    let thumbnailUrl = defaultThumbnail;

    try {
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

      const { error } = await supabase
        .from("posts")
        .update({
          title: data.title,
          content: data.content,
          category: data.category,
          thumbnail: thumbnailUrl,
        })
        .eq("id", id);

      if (error) {
        throw new Error("글 수정 중 오류가 발생했습니다.");
      }

      alert("글이 성공적으로 수정되었습니다.");
      router.push(`/board/view/${id}`);
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
    defaultThumbnail,
  };
}
