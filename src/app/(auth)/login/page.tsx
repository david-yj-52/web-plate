import { auth } from "@/auth";
import LoginButton from "@/components/LoginButton";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  // 이미 로그인된 상태라면 바로 TODO 페이지로 보냅니다.

  if (session) redirect("/todo");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="p-8 border rounded-x1 shadow-lg bg-white text-center">
        <h2 className="text-2xl font-bold mb-6"> 서비스 시작하기 </h2>
        <p className="text-gray-500 mb-8">구글 계정으로 간편하게 시작하세요</p>
        <LoginButton />
      </div>
    </div>
  );
}
