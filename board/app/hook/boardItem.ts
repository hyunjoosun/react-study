import useSWR from "swr";
import { supabase } from "@/lib/supabaseClient";
import { PostWithProfile } from "../types";

export type FormValues = {
  email: string;
  password: string;
};

// fetch
export const fetchItem = async (
  category: string,
  keyword: string,
  page: number,
  itemsPerPage = 10
): Promise<{ posts: PostWithProfile[]; totalPages: number }> => {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let query = supabase
    .from("posts")
    .select(
      `
      *,
      profiles(username, name)
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (category !== "all") query = query.eq("category", category);
  if (keyword) query = query.ilike("title", `%${keyword}%`);

  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    posts: data || [],
    totalPages: Math.ceil((count || 0) / itemsPerPage),
  };
};

// 게시판 리스트 - 아이템
export const useBoardItem = (
  category: string,
  keyword: string,
  page: number,
  itemsPerPage = 10
) => {
  const key = ["boardPosts", category, keyword, page];

  const { data, error, isLoading } = useSWR(key, () =>
    fetchItem(category, keyword, page, itemsPerPage)
  );

  return {
    posts: data?.posts ?? [],
    totalPages: data?.totalPages ?? 0,
    loading: isLoading,
    error,
  };
};
