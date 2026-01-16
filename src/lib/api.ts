// 외부 백엔드 서버와의 통신을 규격화합니다.

const API_BASE_URL = process.env.BACKEND_URL;

export const api = {
  // SSR/Server Action용 fetch 래퍼
  async fetcher(path: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE_URL}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error("API 통신 실패");
    return res.json();
  },
};
