'use client';

import { useEffect, useState, useMemo } from "react";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import api, { handleRateLimitIfAny } from "@/lib/rateLimit";

interface Ticket {
  id: number;
  name: string;
  price: number;
  available_seats: number;
}

interface CountResp {
  ip?: string;
  count?: number;
}

export default function HomePage() {
  const [myIp, setMyIp] = useState("-");
  const [myCount, setMyCount] = useState(0);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [rateLeft, setRateLeft] = useState(0);

  // ✅ 새로고침 횟수 카운트 (API 호출)
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get<CountResp>(`${process.env.NEXT_PUBLIC_API_BASE}`, { headers: { "Cache-Control": "no-store" } });

        // 레이트리밋 (429) 응답 시 처리
        if (await handleRateLimitIfAny(res)) {
          console.warn("🚫 새로고침 제한: RateLimit 트리거됨");
          setBlocked(true);
          const unblockAt = Number(localStorage.getItem("unblockAt") || "0");
          setRateLeft(Math.max(0, Math.ceil((unblockAt - Date.now()) / 1000)));
          return;
        }

        // 정상 응답
        setMyIp(res.data.ip ?? "-");
        setMyCount(res.data.count ?? 0);
      } catch (err) {
        console.error("❌ count fetch error:", err);
      }
    };

    fetchCount();
  }, []);

  // ✅ 차단 자동 해제 (시간 지나면 자동 복구)
  useEffect(() => {
    const unblockAt = Number(localStorage.getItem("unblockAt") || "0");
    if (unblockAt && Date.now() >= unblockAt) {
      localStorage.removeItem("blocked");
      localStorage.removeItem("attempts");
      localStorage.removeItem("unblockAt");
      setBlocked(false);
      setRateLeft(0);
    }

    const timer = setInterval(() => {
      const remain = Math.max(0, Math.ceil((unblockAt - Date.now()) / 1000));
      setRateLeft(remain);
      if (remain <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [blocked]);

  const isDisabled = useMemo(() => rateLeft > 0 || blocked, [rateLeft, blocked]);

  // ✅ 차단 상태일 때 표시
  if (blocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-red-50 text-red-700">
        <h1 className="text-3xl font-bold mb-4">🚫 접근이 차단되었습니다</h1>
        <p className="mb-2">너무 많은 새로고침으로 인해 일시적으로 제한되었습니다.</p>
        <p className="text-sm text-gray-600">
          {rateLeft > 0 ? `${rateLeft}초 후에 자동으로 해제됩니다.` : "잠시 후 새로고침해 주세요."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />

        {/* IP 정보 */}
        <section className="container mx-auto px-4 py-6">
          <div className="rounded-xl border p-4 shadow-sm bg-card text-card-foreground flex items-center gap-6">
            <div>
              <div className="text-sm text-muted-foreground">나의 IP</div>
              <div className="font-mono">{myIp}</div>
            </div>
            <div className="h-10 w-px bg-border" />
            <div>
              <div className="text-sm text-muted-foreground">현재 카운트</div>
              <div className="text-2xl font-bold">{myCount}</div>
            </div>
          </div>
        </section>

        {/* 알림 배너 */}
        {rateLeft > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#fff3cd",
              border: "1px solid #ffeeba",
              color: "#856404",
              padding: "10px 14px",
              borderRadius: 10,
              boxShadow: "0 8px 20px rgba(0,0,0,.08)",
              zIndex: 9999,
            }}
          >
            <strong>요청이 너무 많아요 💦</strong>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              {rateLeft}초 후 다시 시도할 수 있어요.
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
