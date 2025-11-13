"use client";
import React from "react";
import AuthProvider from "@/contexts/AuthContext";

console.log("[ClientProviders] AuthProvider typeof =", typeof AuthProvider); // 브라우저 콘솔에 찍힘

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
