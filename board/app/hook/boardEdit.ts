"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// @review react-hook-form를 사용해서 효과적으로 관리할 필요가 있음
export function useBoardEdit() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id);

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [newThumbnailFile, setNewThumbnailFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

      setTitle(data.title);
      setContent(data.content);
      setCategory(data.category);
      setThumbnail(data.thumbnail || null);
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleThumbnailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setNewThumbnailFile(file);
        setThumbnail(URL.createObjectURL(file));
      }
    },
    []
  );

  const handleThumbnailDelete = useCallback(() => {
    setNewThumbnailFile(null);
    setThumbnail(null);
  }, []);

  const handleCancel = useCallback(() => {
    router.push(`/board/view/${id}`);
  }, [router, id]);

  const handleSubmit = useCallback(async () => {
    let thumbnailUrl = thumbnail;

    if (newThumbnailFile) {
      const fileExt = newThumbnailFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `thumbnail/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnail")
        .upload(filePath, newThumbnailFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert("썸네일 업로드 실패: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("thumbnail")
        .getPublicUrl(filePath);

      thumbnailUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
        thumbnail: thumbnailUrl,
      })
      .eq("id", id);

    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }

    alert("수정 완료");
    router.push(`/board/view/${id}`);
  }, [thumbnail, newThumbnailFile, title, content, category, id, router]);

  return {
    title,
    setTitle,
    content,
    setContent,
    category,
    setCategory,
    thumbnail,
    loading,
    handleThumbnailChange,
    handleThumbnailDelete,
    handleCancel,
    handleSubmit,
  };
}
