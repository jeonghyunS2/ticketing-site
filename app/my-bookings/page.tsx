"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { Database } from "@/types/database.types"; 
// --- [수정] ---
// 1. 전역 인증 상태를 위한 useAuth 훅을 불러옵니다.
import { useAuth } from "@/contexts/AuthContext";

// Order 타입을 자동으로 생성된 타입으로 정의합니다.
type OrderWithTicket = Database['public']['Tables']['orders']['Row'] & {
  tickets: Database['public']['Tables']['tickets']['Row'] | null;
}

export default function MyBookingsPage() {
  // --- [수정] ---
  // 2. 전역 Context에서 user와 로딩 상태를 가져옵니다.
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<OrderWithTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- [수정] ---
    // 3. AuthContext의 로딩이 끝나고 user 정보가 확정되면 데이터를 불러옵니다.
    if (!authLoading) {
      async function fetchOrders() {
        // 4. 이제 getUser() 대신 Context의 user 객체를 바로 사용합니다.
        if (user) {
          const { data, error } = await supabase
            .from('orders')
            .select(`*, tickets (*)`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error("Error fetching orders:", error);
          } else if (data) {
            setOrders(data); 
          }
        }
        setLoading(false);
      }
      fetchOrders();
    }
  }, [user, authLoading]); // user나 authLoading 상태가 바뀔 때마다 실행됩니다.

  // 인증 로딩과 데이터 로딩 상태를 모두 고려합니다.
  const pageLoading = authLoading || loading;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">내 예매 내역</h1>
          <Separator className="my-4" />
        </div>

        {pageLoading ? (
          <p>예매 내역을 불러오는 중...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-muted-foreground mb-4">아직 예매 내역이 없습니다.</p>
            <Button asChild>
              <a href="/">티켓 예매하러 가기</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/4 p-4">
                  <img 
                    src={order.tickets?.image_url || '/placeholder.png'} 
                    alt={order.tickets?.name || 'Ticket Image'} 
                    className="rounded-md object-cover w-full h-auto aspect-[3/4]"
                  />
                </div>
                <div className="flex-1">
                  <CardHeader>
                    <CardTitle>{order.tickets?.name || '공연 정보 없음'}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      예매일: {order.created_at ? new Date(order.created_at).toLocaleDateString('ko-KR') : '날짜 없음'}
                    </p>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p><strong>수량:</strong> {order.quantity ?? 0}매</p>
                    <p><strong>총 결제 금액:</strong> {(order.total_price ?? 0).toLocaleString()}원</p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

