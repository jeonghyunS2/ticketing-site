import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1) 우선 상대경로로 (alias 이슈를 배제)
import ClientProviders from "../components/ClientProviders";
// 2) 나중에 alias로 바꿔도 됨: import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TicketHub",
  description: "Ticketing service for everyone",
};

import TestClient from "../components/TestClient";
console.log("💡 TestClient typeof =", typeof TestClient); // ← function 이면 OK

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 임시 진단 로그
  console.log("💡 ClientProviders typeof =", typeof ClientProviders); // ← function 이 나와야 정상
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
