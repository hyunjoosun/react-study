/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";

export const createSupabaseServerClient = (req: NextRequest) => {
  return createPagesServerClient({
    req: {
      headers: Object.fromEntries(req.headers.entries()),
      cookies: req.cookies,
    } as any,
    res: {} as any,
  });
};
