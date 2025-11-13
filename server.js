// server.js — 완전 정리된 100% 정상 동작 버전
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import createLambdaRateLimiterModule from "./lambdaRateLimitMiddleware.js";

// ─────────────────────────────────────────────
// 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// 환경변수 확인
console.log("[ENV] RATE_LIMIT_URL =", process.env.RATE_LIMIT_URL);
console.log("[ENV] NEXT_PUBLIC_RATE_LIMIT_URL =", process.env.NEXT_PUBLIC_RATE_LIMIT_URL);
console.log("[ENV] COUNT_LAMBDA_URL =", process.env.COUNT_LAMBDA_URL);

// ─────────────────────────────────────────────
// Express
const app = express();
app.set("trust proxy", true);
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─────────────────────────────────────────────
// Lambda URL 설정
const RAW_URL =
  process.env.NEXT_PUBLIC_RATE_LIMIT_URL ||
  process.env.RATE_LIMIT_URL ||
  "";
const COUNT_URL =
  process.env.NEXT_PUBLIC_COUNT_LAMBDA_URL ||
  process.env.COUNT_LAMBDA_URL ||
  "";

// ─────────────────────────────────────────────
// Local fallback rate-limit
const localMap = new Map();
const LOCAL_WINDOW = 30 * 1000;
const LOCAL_MAX_REQ = 6;

// ─────────────────────────────────────────────
// rate-limiter 미들웨어 구성
let rateLimiter = null;

if (RAW_URL) {
  console.log("🔗 Lambda mode enabled →", RAW_URL);

  rateLimiter = createLambdaRateLimiterModule({
    baseUrl: RAW_URL,
    path: "",
    method: "POST",
    timeoutMs: 1500,
    failOpen: false,
    debug: true,
  });
} else {
  console.log("⚠️ Lambda 없음 → 로컬 fallback only");

  rateLimiter = (req, res, next) => {
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const now = Date.now();
    const rec = localMap.get(ip) || { count: 0, first: now };

    if (now - rec.first > LOCAL_WINDOW) {
      localMap.set(ip, { count: 1, first: now });
      return next();
    }

    if (rec.count >= LOCAL_MAX_REQ) {
      const retryAfter = Math.ceil((LOCAL_WINDOW - (now - rec.first)) / 1000);
      return res.status(429).json({
        error: "Too many refreshes",
        retryAfter,
      });
    }

    rec.count++;
    localMap.set(ip, rec);
    next();
  };
}

// ⭐ 꼭 app.use(rateLimiter)는 "rateLimiter 정의된 뒤에" 넣는다
app.use(rateLimiter);

// ─────────────────────────────────────────────
// 헬스체크
app.get("/ping", (req, res) => res.json({ ok: true }));

// ─────────────────────────────────────────────
// Count API
app.get("/api/count", async (req, res) => {
  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
      req.ip ||
      req.socket.remoteAddress ||
      "";

    if (!COUNT_URL) {
      // 로컬 fallback 카운트 증가
      const rec = localMap.get(ip) || { count: 0, first: Date.now() };
      rec.count++;
      localMap.set(ip, rec);
      return res.json({ ip, count: rec.count, ok: true });
    }

    const fixedUrl = COUNT_URL.endsWith("/")
      ? COUNT_URL
      : COUNT_URL + "/";

    const r = await axios.get(fixedUrl, {
      headers: { "x-client-ip": ip },
      timeout: 1500,
      validateStatus: () => true,
    });

    if (r.status === 429) {
      const retryAfter = Number(r.headers["retry-after"] || "30");
      return res.status(429).json({
        error: "Too Many Requests",
        retryAfter,
        ip,
      });
    }

    res.json({
      ok: true,
      ip,
      count: r.data?.count_in_window ?? 0,
    });
  } catch (err) {
    console.error("count lambda error:", err);
    res.status(500).json({ error: "count lambda 호출 실패" });
  }
});

// ─────────────────────────────────────────────
// Server listen
const PORT = 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`💗 서버 실행됨 → http://0.0.0.0:${PORT}`);
});
