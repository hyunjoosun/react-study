import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authUser = req.cookies.get("authUser")?.value;
  const protectedPaths = ["/board", "/mypage", "/admin"];

  if (protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    if (!authUser) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/board/:path*", "/mypage/:path*", "/admin/:path*"],
};
