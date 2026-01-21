import { api } from "@/lib/api";
import { NextResponse } from "next/server";

// Next.js 15에서는 params를 Promise로 처리해야 합니다.
async function proxyHandler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }, // Promise 타입으로 변경
) {
  // 1. params를 await로 기다려서 꺼냅니다.
  const resolvedParams = await params;
  const pathArray = resolvedParams.path;

  const targetPath = `/${pathArray.join("/")}`;
  const method = request.method;

  try {
    console.log("3. Proxy Route Handler 진입");

    let body = undefined;

    // GET이나 HEAD가 아닌 경우에만 body를 읽습니다.
    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        body = await request.json();
      }
    }

    // 서버 사이드 전용 fetcher 호출
    const result = await api.fetcher(targetPath, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log("4. Fetcher 성공 결과:", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("5. Proxy Route Handler 최종 에러:", error); // 여기서 범인이 나옵니다!
    console.error(`Proxy Error (${method} ${targetPath}):`, error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 모든 Method에 대해 핸들러 연결
export {
  proxyHandler as GET,
  proxyHandler as POST,
  proxyHandler as PUT,
  proxyHandler as DELETE,
};
