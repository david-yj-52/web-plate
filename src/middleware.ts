import { auth } from "@/auth";
import { NextResponse } from "next/server";

const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|css|js)$/i;

export default auth((req) => {
  const pathname = req.nextUrl.pathname;

  // public 정적 파일(이미지 등)은 인증 검사 없이 통과
  if (STATIC_EXT.test(pathname)) {
    return NextResponse.next();
  }

  const isLoggedIn = !!req.auth;
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
