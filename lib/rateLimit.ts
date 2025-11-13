import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// ✅ 공통 axios 인스턴스
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: { "Content-Type": "application/json" },

  // ★★★★★ 핵심 ★★★★★
  validateStatus: () => true, 
});


// ✅ 요청 시 레이트리밋 헤더 포함
api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config.headers) config.headers = {};
  config.headers["X-RateLimit-Check"] = process.env.NEXT_PUBLIC_RATE_LIMIT_URL || "";
  return config;
});

// ✅ 응답 헬퍼 (429 감지)
export async function handleRateLimitIfAny(res: AxiosResponse): Promise<boolean> {
  if (res.status === 429) {
    const retryAfter = parseInt(res.headers["retry-after"] ?? "30", 10);
    const attempts = Number(localStorage.getItem("attempts") || "0") + 1;

    localStorage.setItem("attempts", attempts.toString());

    // 5회 초과 → 완전 차단
    if (attempts >= 5) {
      localStorage.setItem("blocked", "true");
      const unblockAt = Date.now() + retryAfter * 1000;
      localStorage.setItem("unblockAt", unblockAt.toString());
      return true;
    }

    // 일반 RateLimit → 일정 시간 대기
    const unblockAt = Date.now() + retryAfter * 1000;
    localStorage.setItem("unblockAt", unblockAt.toString());
    return true;
  }
  return false;
}

export default api;
