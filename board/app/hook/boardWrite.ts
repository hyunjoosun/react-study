import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export type FormData = {
  category: string;
  title: string;
  content: string;
  thumbnail: FileList | null;
};

export const useBoardWrite = () => {
  const router = useRouter();
  const user = useUser();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      category: "",
      title: "",
      content: "",
      thumbnail: null,
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: FileList | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(e.target.files);
      setPreview(URL.createObjectURL(file));
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

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
        console.error(uploadError);
        alert("썸네일 업로드 중 오류가 발생했습니다.");
        return;
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
      console.error(error);
      alert("글 등록 중 오류가 발생했습니다.");
    } else {
      alert("글이 성공적으로 등록되었습니다.");
      router.push("/board");
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    errors,
    handleFileChange,
    preview,
    setPreview,
  };
};
