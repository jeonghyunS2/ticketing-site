"use client";

import { useEffect, useState } from "react";

type Resp = { ip?: string; count?: number; error?: string };

export default function IpCounter() {
  const [ip, setIp] = useState<string>("-");
  const [count, setCount] = useState<number>(0);
  const [msg, setMsg] = useState<string>("로딩 중…");

  useEffect(() => {
    let timer: any;

    (async () => {
      try {
        const r = await fetch("/api/count", { method: "GET", cache: "no-store" });

        // 레이트리밋(429) 대응: Retry-After 헤더 카운트다운 후 자동 새로고침
        if (r.status === 429) {
          let left = parseInt(r.headers.get("Retry-After") || "5", 10);
          setMsg(`요청이 많아요. ${left}초 뒤 재시도…`);
          timer = setInterval(() => {
            left -= 1;
            setMsg(`요청이 많아요. ${Math.max(left, 0)}초 뒤 재시도…`);
            if (left <= 0) location.reload();
          }, 1000);
          return;
        }

        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: Resp = await r.json();

        setIp(data.ip ?? "-");
        setCount(data.count ?? 0);
        setMsg("완료");
      } catch (e: any) {
        setMsg(`오류: ${e.message}`);
      }
    })();

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", lineHeight: 1.6 }}>
      <h2>IP 요청 카운터</h2>
      <p style={{ opacity: .6 }}>이 페이지를 새로고침하면 카운트가 증가합니다.</p>
      <div><b>나의 IP:</b> {ip}</div>
      <div style={{ fontSize: 24 }}><b>현재 카운트:</b> {count}</div>
      <p style={{ opacity: .6 }}>{msg}</p>
    </div>
  );
}
