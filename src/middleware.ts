import { auth } from "@/auth"; // 경로 수정
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isRegisterPage = req.nextUrl.pathname === "/register";

  // 로그인이 안 되었는데 보호된 페이지에 접근하면 로그인으로 이동
  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
