"use client";

import { useState, useEffect, FormEvent } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { supabase } from '@/lib/supabaseClient'; // Supabase 클라이언트 추가

// --- 좌석 등급 및 가격 정의 ---
type SeatGrade = '응원석' | '일반석';

const PRICES: Record<SeatGrade, number> = {
  '응원석': 70000,
  '일반석': 65000,
};

interface Seat {
  id: string;
  status: 'available' | 'taken';
  grade: SeatGrade;
}

interface BankAccount {
  bankName: string;
  accountNumber: string;
  expires: string;
}

const MAX_SELECTION = 4;

export default function LckMatchBookingPage() {
  // --- State 관리 ---
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);

  // --- 좌석 데이터 생성 ---
  useEffect(() => {
    const newSeats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    rows.forEach((row, rowIndex) => {
      const grade: SeatGrade = rowIndex < 4 ? '응원석' : '일반석';
      for (let i = 1; i <= 10; i++) {
        newSeats.push({
          id: `${row}${i}`,
          status: Math.random() > 0.7 ? 'taken' : 'available',
          grade: grade,
        });
      }
    });
    setSeats(newSeats);
  }, []);

  // --- 이벤트 핸들러 ---
  const handleAddToCart = () => {
    const cartItem = {
      id: "lck_summer_playoffs_2025",
      title: "2025 LCK Summer Playoffs R1",
      price: PRICES['응원석'],
      quantity: 1,
      poster: "/lck-poster-large.png",
    };
    const existingCart = JSON.parse(localStorage.getItem("shopping_cart") || "[]");
    const itemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id);
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }
    localStorage.setItem("shopping_cart", JSON.stringify(existingCart));
    alert("상품을 장바구니에 담았습니다.");
  };

  const handlePaymentChange = (value: string) => {
    setPaymentMethod(value);
    if (value === "bank_transfer") {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 24);
      setBankAccount({
        bankName: "우리은행",
        accountNumber: `1002-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900000) + 100000}`,
        expires: expiryDate.toLocaleString('ko-KR'),
      });
    } else {
      setBankAccount(null);
    }
  };
  
  const handleSelectSeat = (seat: Seat) => {
    if (seat.status === 'taken') return;
    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);
    if (isAlreadySelected) {
      setSelectedSeats(prevSeats => prevSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= MAX_SELECTION) {
        alert(`최대 ${MAX_SELECTION}석까지 선택 가능합니다.`);
        return;
      }
      setSelectedSeats(prevSeats => [...prevSeats, seat]);
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("좌석을 선택해주세요.");
      return;
    }
    handlePaymentChange("credit_card"); 
    setIsSeatModalOpen(false);
    setIsPaymentModalOpen(true);
  };
  
  // --- [수정된 부분] ---
  const handleConfirmBooking = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    const newOrder = {
      user_id: user.id,
      ticket_id: 3, // 'LCK 플레이오프'가 tickets 테이블의 3번이라고 가정
      quantity: selectedSeats.length,
      total_price: totalPrice,
      status: 'confirmed'
    };

    const { error } = await supabase.from('orders').insert(newOrder);

    if (error) {
      alert(`예매에 실패했습니다: ${error.message}`);
    } else {
      alert('예매가 성공적으로 완료되었습니다!');
      setIsPaymentModalOpen(false);
      setSelectedSeats([]);
    }
  };
  // --- [여기까지 수정] ---
  
  const handleCloseModals = () => {
    setIsSeatModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedSeats([]);
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + PRICES[seat.grade], 0);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">경기 상세 및 예매</h1>
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img src="/lck-poster-large.png" alt="LCK Match Poster" className="rounded-lg shadow-lg w-full"/>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-extrabold">2025 LCK Summer Playoffs R1</h2>
            <p className="text-lg text-muted-foreground mt-2">T1 vs Gen.G</p>
            <Separator className="my-6" />
            <div className="space-y-4 text-base">
              <p><strong>🗓️ 날짜:</strong> 2025년 9월 20일 (토) 17:00</p>
              <p><strong>📍 장소:</strong> LoL PARK (그랑서울 3F)</p>
            </div>
            <Card className="mt-8">
              <CardHeader><CardTitle>좌석 및 가격</CardTitle></CardHeader>
              <CardContent>
                <img src="/lol-park-seatmap.png" alt="LoL Park Seatmap" className="rounded-md w-full mb-6 border" />
                <div className="space-y-3">
                  <div className="flex justify-between items-center"><span className="font-semibold text-lg">응원석</span><span className="text-lg font-bold">70,000원</span></div>
                  <div className="flex justify-between items-center"><span className="font-semibold text-lg">일반석</span><span className="text-lg font-bold">65,000원</span></div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-8">
                  <Button variant="outline" onClick={handleAddToCart}>장바구니 담기</Button>
                  <Button onClick={() => setIsSeatModalOpen(true)}>좌석 선택하기</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- 좌석 선택 모달 --- */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">좌석 선택 (최대 {MAX_SELECTION}매)</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModals}><X className="h-5 w-5" /></Button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="w-full bg-foreground text-background text-center py-2 rounded-md mb-6 font-bold">STAGE</div>
              <div className="grid grid-cols-10 gap-2">
                {seats.map(seat => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  let gradeColor = '';
                  if (seat.grade === '응원석') gradeColor = 'bg-blue-300 hover:bg-blue-400';
                  else if (seat.grade === '일반석') gradeColor = 'bg-gray-200 hover:bg-gray-300';

                  return (
                    <button key={seat.id} onClick={() => handleSelectSeat(seat)} disabled={seat.status === 'taken'}
                      className={`aspect-square text-xs rounded ${seat.status === 'taken' ? 'bg-muted text-muted-foreground cursor-not-allowed' : gradeColor} ${isSelected ? '!bg-primary !text-primary-foreground' : ''}`}>
                      {seat.id}
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-center gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-300"></div>응원석</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gray-200"></div>일반석</div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-between items-center">
              <div>
                <p className="text-sm">총 금액</p>
                <p className="font-bold text-xl">{totalPrice.toLocaleString()}원</p>
              </div>
              <Button onClick={handleProceedToPayment} disabled={selectedSeats.length === 0}>
                다음 단계 ({selectedSeats.length}석)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- 결제 모달 --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">결제하기</h2>
                    <Button variant="ghost" size="icon" onClick={handleCloseModals}><X className="h-5 w-5" /></Button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">예매 정보</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                            <p><strong>경기:</strong> 2025 LCK Summer Playoffs R1</p>
                            <p><strong>선택 좌석:</strong> {selectedSeats.map(s => s.id).join(', ')}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">결제 수단</h3>
                        <RadioGroup defaultValue={paymentMethod} onValueChange={handlePaymentChange}>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="credit_card" id="r1" /><Label htmlFor="r1">신용카드</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="bank_transfer" id="r2" /><Label htmlFor="r2">무통장입금</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="simple_pay" id="r3" /><Label htmlFor="r3">간편결제</Label></div>
                        </RadioGroup>
                        {paymentMethod === 'bank_transfer' && bankAccount && (
                            <Card className="mt-4 bg-muted/50 p-4 text-sm">
                                <p><strong>입금 계좌:</strong> {bankAccount.bankName} {bankAccount.accountNumber}</p>
                                <p><strong>입금 기한:</strong> {bankAccount.expires} 까지</p>
                            </Card>
                        )}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-xl">
                        <span>총 결제 금액</span>
                        <span>{totalPrice.toLocaleString()}원</span>
                    </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-b-lg">
                    <Button className="w-full" onClick={handleConfirmBooking}>결제하기</Button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}