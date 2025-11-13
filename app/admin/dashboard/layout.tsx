// app/admin/dashboard/layout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListOrdered, Users, Home, CreditCard } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <Link href="/admin/dashboard" className="mb-8 flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">Admin Menu</h1>
        </Link>
        <nav className="flex flex-col gap-1">
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive("/admin/dashboard") && "bg-muted text-primary font-semibold")}>
            <ListOrdered className="h-4 w-4" />
            공연 관리
          </Link>
          <Link href="/admin/dashboard/users" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive("/admin/dashboard/users") && "bg-muted text-primary font-semibold")}>
            <Users className="h-4 w-4" />
            계정 관리
          </Link>
          <Link href="/admin/dashboard/payments" className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary", isActive("/admin/dashboard/payments") && "bg-muted text-primary font-semibold")}>
            <CreditCard className="h-4 w-4" />
            입금내역 확인
          </Link>
        </nav>
        <div className="mt-auto flex flex-col gap-1">
          <LogoutButton />
          <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-sm">
            <Home className="h-4 w-4" />
            메인 사이트로
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}