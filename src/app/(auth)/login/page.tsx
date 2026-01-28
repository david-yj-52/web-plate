import { auth } from "@/auth";
import LoginButton from "@/components/LoginButton";
import TshLogo from "@/components/TshLogo";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  // 이미 로그인된 상태라면 바로 TODO 페이지로 보냅니다.
  if (session) redirect("/todo");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg px-10 py-12">
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <TshLogo />
          </div>
          <h1 className="relative z-10 text-center text-2xl md:text-3xl font-bold text-gray-900">
            Sign in to Service TSH
          </h1>
        </div>

        <div className="mb-6">
          <LoginButton />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wide mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="EMAIL"
              className="w-full h-11 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="PASSWORD"
              className="w-full h-11 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="button"
            className="w-full h-11 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-900"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
