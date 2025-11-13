// lambdaRateLimitMiddleware.js
const axios = require("axios");

/* IPv6 로컬 등 정규화 */
function normalizeIp(ip) {
  if (!ip) return "0.0.0.0";
  if (ip === "::1") return "127.0.0.1";
  const m = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  return m ? m[1] : ip;
}

function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  const raw = xff ? xff.split(",")[0].trim()
                  : (req.socket?.remoteAddress || req.connection?.remoteAddress || "");
  return normalizeIp(raw);
}

function createLambdaRateLimiter(options = {}) {
  const {
    baseUrl = process.env.NEXT_PUBLIC_RATE_LIMIT_URL,
    path = "/api/test",
    method = "GET",
    timeoutMs = 1200,
    failOpen = false,  // 운영 권장: 차단 신호는 그대로 차단
    debug = false,
  } = options;

  if (!baseUrl) throw new Error("NEXT_PUBLIC_RATE_LIMIT_URL 이(가) 필요합니다.");
  const endpoint = `${baseUrl}${path}`;

  return async function lambdaRateLimiter(req, res, next) {
    const ip = getClientIp(req);
    const headers = {
      "x-client-ip": ip,
      "x-method": req.method,
      "x-path": req.originalUrl || req.url,
    };

    try {
      // ✅ 429/4xx/5xx도 예외로 던지지 않음
      const opts = { headers, timeout: timeoutMs, validateStatus: () => true };

      const r = method === "GET"
        ? await axios.get(endpoint, opts)
        : await axios.post(endpoint, {}, opts);

      const limit = r.headers["x-ratelimit-limit"];
      const remaining = r.headers["x-ratelimit-remaining"];
      const reset = r.headers["x-ratelimit-reset"];
      const retryAfter = r.headers["retry-after"];

      if (debug) {
        console.log(`[RL] -> ${endpoint} ip=${ip} method=${req.method} path=${req.originalUrl}`);
        console.log(`[RL] <- status=${r.status} limit=${limit} remain=${remaining} reset=${reset} retry=${retryAfter}`);
      }

      // ✅ 허용(2xx) → 통과
      if (r.status >= 200 && r.status < 300) {
        if (limit) res.set("X-RateLimit-Limit", String(limit));
        if (remaining) res.set("X-RateLimit-Remaining", String(remaining));
        if (reset) res.set("X-RateLimit-Reset", String(reset));
        return next();
      }

      // ✅ 차단 신호 판단: (1) 429 이거나 (2) 남은 횟수 0 이거나 (3) Retry-After 존재
      const isRateLimited = (r.status === 429) ||
                            (typeof remaining !== "undefined" && String(remaining) === "0") ||
                            (typeof retryAfter !== "undefined");

      if (isRateLimited) {
        if (retryAfter) res.set("Retry-After", String(retryAfter));
        if (limit) res.set("X-RateLimit-Limit", String(limit));
        res.set("X-RateLimit-Remaining", "0");
        if (reset) res.set("X-RateLimit-Reset", String(reset));

        const body = (r.data && typeof r.data === "object")
          ? r.data
          : { message: "Too Many Requests", limit: Number(limit)||undefined, remaining: 0, reset_epoch: Number(reset)||undefined };

        if (debug) console.log("[RL] returning 429 to client");
        return res.status(429).json(body);   // ← 반드시 return!
      }

      // 이 외(3xx/4xx/5xx) → 정책
      if (debug) console.log("[RL] non-2xx & not rate-limit; failOpen=", failOpen, "status=", r.status);
      return failOpen ? next() : res.status(503).json({ error: "RateLimit check unavailable" });

    } catch (e) {
      // 네트워크/타임아웃 같은 진짜 예외만 여기
      if (debug) console.warn("[RL] exception:", e.message || e);
      return failOpen ? next() : res.status(503).json({ error: "RateLimit check failed" });
    }
  };
}

// 기본 + 이름 내보내기
module.exports = createLambdaRateLimiter;
module.exports.createLambdaRateLimiter = createLambdaRateLimiter;
