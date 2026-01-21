import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function proxyHandler(
  request: Request,
  { params }: { params: { path: string[] } },
) {
  const targetPath = `/${params.path.join("/")}`;
  const method = request.method;
  let body = undefined;

  // GET이나 DELETE가 아니면 바디를 읽음
  if (method !== "GET" && method !== "DELETE") {
    body = await request.json();
  }

  try {
    const result = await api.fetcher(targetPath, {
      method: method,
      body: body ? JSON.stringify(body) : undefined,
    });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Proxy Error (${method}):`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export {
  proxyHandler as GET,
  proxyHandler as POST,
  proxyHandler as PUT,
  proxyHandler as DELETE,
};
