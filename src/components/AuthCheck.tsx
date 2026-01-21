"use client";

import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCheck() {
  const { data: session } = useSession(); // idToken이 들어있음
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      // 세션에 idToken이 있을 때만 실행
      if (session?.idToken) {
        try {
          const result = await api.fetcher("/api/auth/check", {
            method: "POST",
            body: JSON.stringify({ code: session.idToken }),
          });

          if (result.sstatus === "NEW") {
            router.push("/register");
          } else {
            // 가입된 유저는 가만히 둠
            console.log("로그인 성공:", result.userKey);
          }
        } catch (error) {
          console.error("인증 체크 실패: ", error);
        }
      }
    };
    checkUserStatus();
  }, [session, router]);

  return null;
}
