import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();

  // 로그인한 사용자 정보 가져오기
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "인증 실패" }, { status: 401 });
  }

  const formData = await req.formData();
  const category = formData.get("category")?.toString() || "";
  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  const thumbnailFileRaw = formData.get("thumbnail");
  const thumbnailFile =
    thumbnailFileRaw instanceof File ? thumbnailFileRaw : null;

  if (!category || !title || !content) {
    return NextResponse.json({ error: "필수 항목 누락" }, { status: 400 });
  }

  let thumbnailUrl = "";

  if (thumbnailFile) {
    const fileExt = thumbnailFile.name.split(".").pop();
    const filePath = `thumbnails/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("thumbnail")
      .upload(filePath, thumbnailFile, {
        contentType: thumbnailFile.type,
      });

    if (error) {
      console.error("썸네일 업로드 실패:", error);
      return NextResponse.json(
        { error: "썸네일 업로드 실패" },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("thumbnail").getPublicUrl(filePath);

    thumbnailUrl = publicUrl;
  }

  const { error: insertError } = await supabase.from("Post").insert([
    {
      category,
      title,
      content,
      thumbnail: thumbnailUrl,
      author_id: user.id,
    },
  ]);

  if (insertError) {
    console.error("DB 삽입 실패:", insertError);
    return NextResponse.json({ error: "DB 삽입 실패" }, { status: 500 });
  }

  return NextResponse.json({ message: "등록 성공!" }, { status: 201 });
}
