// app/admin/dashboard/LogoutButton.tsx

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 세션 스토리지에서 관리자 로그인 정보 삭제
    sessionStorage.removeItem("admin_logged_in");
    alert("로그아웃 되었습니다.");
    // 관리자 로그인 페이지로 이동
    router.replace("/admin");
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm"
    >
      <LogOut className="h-4 w-4" />
      로그아웃
    </Button>
  );
}