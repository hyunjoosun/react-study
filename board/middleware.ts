import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const authUser = req.cookies.get("authUser")?.value;
  const pathname = req.nextUrl.pathname;

  const protectedPaths = ["/board", "/mypage", "/admin"];

  if (pathname === "/") {
    if (authUser) {
      return NextResponse.redirect(new URL("/board", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!authUser) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/board/:path*", "/mypage/:path*", "/admin/:path*"],
};
