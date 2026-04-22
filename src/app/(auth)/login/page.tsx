import { auth, signIn } from "@/auth";
import LoginButton from "@/components/LoginButton";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/todo");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg px-10 py-12">
        <div className="mb-10">
          <h1 className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold text-gray-900">
            <span>Sign in to Service TSH</span>
          </h1>
        </div>

        {/* Google 로그인 */}
        <div className="mb-6">
          <LoginButton />
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wide mb-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span>or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* ✅ Credentials 로그인 */}
        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("credentials", {
              username: formData.get("username"),
              password: formData.get("password"),
              redirectTo: "/todo",
            });
          }}
          className="space-y-4"
        >
          <div>
            <input
              type="text"
              name="username"
              placeholder="USERNAME"
              className="w-full h-11 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              className="w-full h-11 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full h-11 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-900"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}
