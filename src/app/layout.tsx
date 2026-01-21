import { auth } from "@/auth";
import "./globals.css";
import ApHeader from "@/components/layout/ApHeader";
import AuthCheck from "@/components/AuthCheck";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "My Todo App",
  description: "Next.Js 15",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">
        <SessionProvider>
          {/* 로그인이 된 경우에만 상단 헤더를 보여줍니다. */}
          {session && <ApHeader user={session.user} />}
          <main className="container mx-auto px-4 py-8">
            <AuthCheck />
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
