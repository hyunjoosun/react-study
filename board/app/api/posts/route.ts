import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const category = formData.get("category")?.toString() || "";
  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const thumbnailFile = formData.get("thumbnail") as File | null;

  if (!category || !title || !content) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  let thumbnailUrl = "";

  if (thumbnailFile) {
    const fileExt = thumbnailFile.name.split(".").pop();
    const filePath = `thumbnails/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("thumbnail_url") // 스토리지 버킷 이름
      .upload(filePath, thumbnailFile, {
        contentType: thumbnailFile.type,
      });

    if (error) {
      console.error("썸네일 업로드 실패:", error);
      return NextResponse.json({ error: "썸네일 업로드 실패" }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("thumbnail_url").getPublicUrl(filePath);

    thumbnailUrl = publicUrl;
  }

  const { error: insertError } = await supabase.from("posts").insert([
    {
      category,
      title,
      content,
      thumbnail: thumbnailUrl,
    },
  ]);

  if (insertError) {
    console.error("DB 삽입 실패:", insertError);
    return NextResponse.json({ error: "DB 삽입 실패" }, { status: 500 });
  }

  return NextResponse.json({ message: "등록 성공!" }, { status: 201 });
}
