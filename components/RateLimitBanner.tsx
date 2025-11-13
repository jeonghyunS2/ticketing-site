"use client";
import React from "react";
import { onRateLimit } from "@/lib/rateLimit";

export default function RateLimitBanner() {
  const [left, setLeft] = React.useState(0);
  const [meta, setMeta] = React.useState<{limit?: string|null; remaining?: string|null}>({});

  React.useEffect(() => {
    const off = onRateLimit(({ seconds, limit, remaining }) => {
      setLeft(seconds);
      setMeta({ limit, remaining });
    });
    const t = setInterval(() => setLeft(s => (s>0 ? s-1 : 0)), 1000);
    return () => { off(); clearInterval(t); };
  }, []);

  if (left <= 0) return null;

  return (
    <div style={{
      position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)",
      background:"#fff3cd", border:"1px solid #ffeeba", color:"#856404",
      padding:"10px 14px", borderRadius:10, boxShadow:"0 8px 20px rgba(0,0,0,.08)", zIndex:9999
    }}>
      <strong>요청이 잠시 많아요 💦</strong>
      <div style={{fontSize:14, marginTop:4}}>
        {left}초 후 다시 시도해 주세요. (한도: {meta.limit ?? "?"}/분)
      </div>
      <button disabled style={{opacity:.6, cursor:"not-allowed", marginTop:6, padding:"6px 10px", borderRadius:8, border:"1px solid #ccc", background:"#f8f9fa"}}>
        재시도 ({left})
      </button>
    </div>
  );
}
