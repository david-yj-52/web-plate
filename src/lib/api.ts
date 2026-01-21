// 외부 백엔드 서버와의 통신을 규격화합니다.

const API_BASE_URL = process.env.BACKEND_URL;

export const api = {
  // 1. 서버 전용 (route.ts나 Server Action에서 사용)
  async fetcher(path: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`Backend API Error: ${res.status}`);
    return res.json();
  },

  // 2. 클라이언트 전용 (컴포넌트에서 호출 시 사용)
  async client(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "POST",
    body: any,
  ) {
    const res = await fetch(`/api/proxy${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      // GET이나 DELETE는 보통 body가 없으므로 조건부 처리
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  },
};
