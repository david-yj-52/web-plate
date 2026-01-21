"use client";

import { api } from "@/lib/api";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AuthCheck() {
  const { data: session, status } = useSession(); // idToken이 들어있음
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isProcessing.current) return; // 이미 요청 중이라면 중단

      // 1. 세션 로딩 중이면 대기
      if (status === "loading") return;

      // 2. 세션이 없으면 즉시 종료 (미들웨어가 처리하지만 안전장치)
      if (status === "unauthenticated" || !session?.idToken) {
        setIsChecked(true);
        return;
      }

      // 세션에 idToken이 있을 때만 실행
      if (session?.idToken) {
        try {
          isProcessing.current = true;
          const result = await api.client("/user/auth/check", "POST", {
            code: session.idToken,
            siteId: "TSH",
          });

          if (result.status === "NEW") {
            setIsChecked(true);
            router.push("/register");
          } else if (result.status === "EXISTING") {
            // 가입 유저 -> 통과
            console.log("서비스 로그인 성공:", result.userKey);
            setIsChecked(true);
          } else {
            // 그 외 정의되지 않은 상태값 응답 시 처리
            signOut({ callbackUrl: "/login", redirect: true }); // 강제 로그아웃 후 로그인 페이지 이동
            throw new Error("Unknown user status");
          }
        } catch (error) {
          console.error("백엔드 인증 체크 실패: ", error);

          // 중요: 서버 체크 실패 시 로그아웃 시키거나 로그인 페이지로 리다이렉트
          // 우리 서버 DB와 동기화되지 않은 유저는 '로그인 된 것'으로 간주하지 않음
          alert("인증 서버와 통신에 실패했습니다. 다시 로그인해주세요.");
          signOut({ callbackUrl: "/login", redirect: true }); // 강제 로그아웃 후 로그인 페이지 이동
        } finally {
          isProcessing.current = false;
        }
      }
    };
    checkUserStatus();
  }, [session, status, router]);

  // 체크가 완료되지 않았거나 로딩 중이면 화면에 아무것도 그리지 않음 (중요)
  if (status === "loading" || !isChecked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
}
