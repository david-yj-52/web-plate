"use client";

import { api } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const [userCategory, setUserCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // 1. 인증되지 않는 사용자가 접근하면 로그인 페이지로 튕겨내기
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/login");
    }
  }, [status, router]);

  const handleRegister = async () => {
    if (!session?.idToken) return alert("인증 정보가 없습니다.");
    if (!userCategory.trim())
      return alert("모든 정보가 다 들어 있지 않습니다.");

    setIsSubmitting(true);

    try {
      const result = await api.client("/api/auth/register", "POST", {
        code: session.idToken, // token 내 유저정보가 들어있음
        sietId: "TSH",
        userCategory: "Worker",
        socialType: "GGL",
        //  백엔드로 회원 가입 요청
      });

      if (result.error) throw new Error(result.error);
      router.push("/");
    } catch (error: any) {
      alert(`가입 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-8">
        {/* 헤더 섹션 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-blue-600">
              {session?.user?.name}
            </span>
            님,
            <br />
            만나서 반가워요!
          </p>
        </div>

        {/* 폼 섹션 */}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="userCategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              사용자 카테고리
            </label>
            <input
              id="userCategory"
              type="text"
              value={userCategory}
              onChange={(e) => setUserCategory(e.target.value)}
              placeholder="유저의 카테고리를 지정해주세요. (Worker  또는 Manager)"
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={isSubmitting || !userCategory.trim()}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
              isSubmitting || !userCategory.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                  처리 중...
                </svg>
              </span>
            ) : (
              "가입완료"
            )}
          </button>
        </div>

        {/*  안내 문구 */}
        <p className="mt-6 text-center text-xs text-gray-400">
          가입 시 서비스 이용 약관에 동의하게 딥니다.
        </p>
      </div>
    </div>
  );
}
