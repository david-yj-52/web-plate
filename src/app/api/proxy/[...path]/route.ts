import { auth } from "@/auth";
import { api } from "@/lib/api";
import { NextResponse } from "next/server";

async function proxyHandler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const resolvedParams = await params;
  const url = new URL(request.url);
  const targetPath = `/${resolvedParams.path.join("/")}${url.search}`;
  const method = request.method;

  const session = await auth();

  try {
    let body = undefined;
    if (method !== "GET" && method !== "HEAD") {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        body = await request.json();
      }
    }

    const headers: Record<string, string> = {};
    if (session?.user?.accessToken) {
      headers.Authorization = `Bearer ${session.user.accessToken}`;
    }

    const result = await api.fetcher(targetPath, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error(`Proxy Error (${method} ${targetPath}):`, error);
    return NextResponse.json(
      error.body || { error: error.message || "Internal Server Error" },
      { status: error.status || 500 },
    );
  }
}

export {
  proxyHandler as GET,
  proxyHandler as POST,
  proxyHandler as PUT,
  proxyHandler as DELETE,
};
