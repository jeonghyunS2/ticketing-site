"use client";
import React from "react";

export default function RateGuard({ children }: { children: React.ReactNode }) {
  // TODO: 필요하면 여기서 /ping 호출 후 429면 오버레이 띄우도록 확장
  return <>{children}</>;
}
