import { auth } from "@/auth";
import "./globals.css";
import ApHeader from "@/components/layout/ApHeader";

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
        {/* 로그인이 된 경우에만 상단 헤더를 보여줍니다. */}
        {session && <ApHeader user={session.user} />}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
