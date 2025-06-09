import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const createSupabaseServerClient = () => {
  return createServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    cookies,
  });
};
