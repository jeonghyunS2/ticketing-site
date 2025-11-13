"use client";

import { useState, useEffect, FormEvent } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

// --- [수정] ---
// 1. 좌석 등급과 가격 정보를 명확하게 정의합니다.
type SeatGrade = 'W' | 'E' | 'N/S';

const PRICES: Record<SeatGrade, number> = {
  'W': 50000,
  'E': 30000,
  'N/S': 20000,
};

// 2. 좌석 타입에 grade를 추가합니다.
interface Seat {
  id: string;
  status: 'available' | 'taken';
  grade: SeatGrade;
}
// --- 여기까지 수정 ---

interface BankAccount {
  bankName: string;
  accountNumber: string;
  expires: string;
}

const MAX_SELECTION = 4;

export default function SoccerMatchBookingPage() {
  // --- State 관리 ---
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);

  // --- 좌석 데이터 생성 ---
  useEffect(() => {
    // --- [수정] ---
    // 3. 좌석 생성 시 등급을 할당합니다.
    const newSeats: Seat[] = [];
    // 200석 (10열 x 20석)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    rows.forEach((row, rowIndex) => {
      let grade: SeatGrade;
      if (rowIndex < 2) grade = 'W';       // A, B열은 W석 (프리미엄)
      else if (rowIndex < 7) grade = 'E'; // C~G열은 E석 (일반)
      else grade = 'N/S';                 // H~J열은 N/S석 (서포터)

      for (let i = 1; i <= 20; i++) {
        newSeats.push({
          id: `${row}${i}`,
          status: Math.random() > 0.8 ? 'taken' : 'available',
          grade: grade,
        });
      }
    });
    setSeats(newSeats);
  }, []);
  // --- 여기까지 수정 ---

  // --- 이벤트 핸들러 ---

  const handleAddToCart = () => {
    const cartItem = {
      id: "kleague_seoul_jeonbuk_2025",
      title: "K League 1 - FC 서울 vs 전북 현대",
      price: PRICES['E'], // 대표 가격으로 E석 가격을 사용
      quantity: 1,
      poster: "/soccer-match-poster.jpg",
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
        bankName: "신한은행",
        accountNumber: `110-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900000) + 100000}`,
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

  const handleConfirmBooking = () => {
    const newBooking = {
      id: Date.now(),
      title: "K League 1 - 라이벌 매치",
      match: "FC 서울 vs 전북 현대 모터스",
      date: "2025년 10월 5일 (일) 16:30",
      // --- [수정] 예매 정보에 좌석 등급을 포함합니다. ---
      seats: selectedSeats.map(s => `${s.id}(${s.grade}석)`).join(', '),
      totalPrice: totalPrice, // 동적으로 계산된 최종 가격 사용
      // --- 여기까지 수정 ---
      paymentMethod: paymentMethod,
      bankAccount: paymentMethod === 'bank_transfer' ? bankAccount : null,
      poster: "/soccer-match-poster.jpg",
    };

    const existingBookings = JSON.parse(localStorage.getItem("my_bookings") || "[]");
    existingBookings.push(newBooking);
    localStorage.setItem("my_bookings", JSON.stringify(existingBookings));

    let confirmationMessage = `${selectedSeats.map(s => s.id).join(', ')}석 예매가 완료되었습니다!`;
    if (newBooking.bankAccount) {
      confirmationMessage += `\n\n입금 계좌: ${newBooking.bankAccount.bankName} ${newBooking.bankAccount.accountNumber}\n입금 기한: ${newBooking.bankAccount.expires} 까지`;
    }
    alert(confirmationMessage);

    setIsPaymentModalOpen(false);
    setSelectedSeats([]);
  };

  const handleCloseModals = () => {
    setIsSeatModalOpen(false);
    setIsPaymentModalOpen(false);
    setSelectedSeats([]);
  }

  // --- [수정] ---
  // 4. 선택된 좌석들의 등급에 맞춰 총 금액을 동적으로 계산합니다.
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + PRICES[seat.grade], 0);
  // --- 여기까지 수정 ---

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">경기 상세 및 예매</h1>
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img src="/soccer-match-poster.jpg" alt="Soccer Match Poster" className="rounded-lg shadow-lg w-full"/>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-4xl font-extrabold">K League 1 - 라이벌 매치</h2>
            <p className="text-lg text-muted-foreground mt-2">FC 서울 vs 전북 현대 모터스</p>
            <Separator className="my-6" />
            <div className="space-y-4 text-base">
              <p><strong>🗓️ 날짜:</strong> 2025년 10월 5일 (일) 16:30</p>
              <p><strong>📍 장소:</strong> 서울월드컵경기장</p>
            </div>
            <Card className="mt-8">
              <CardHeader><CardTitle>좌석 및 가격</CardTitle></CardHeader>
              <CardContent>
                <img src="/seoul-stadium-seatmap.png" alt="Seoul World Cup Stadium Seatmap" className="rounded-md w-full mb-6 border" />
                <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">W석 (프리미엄)</span><span className="text-lg font-bold">50,000원</span></div>
                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">E석 (일반)</span><span className="text-lg font-bold">30,000원</span></div>
                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">N/S석 (서포터)</span><span className="text-lg font-bold">20,000원</span></div>
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

      {/* --- 좌석 선택 모달 (UI 수정) --- */}
      {isSeatModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">좌석 선택 (최대 {MAX_SELECTION}매)</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModals}><X className="h-5 w-5" /></Button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="w-full bg-green-700 text-white text-center py-2 rounded-md mb-6 font-bold">FIELD</div>
              {/* --- [수정] 등급별 색상 표시 --- */}
              <div className="grid grid-cols-20 gap-1">
                {seats.map(seat => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  let gradeColor = '';
                  if (seat.grade === 'W') gradeColor = 'bg-yellow-200 hover:bg-yellow-300';
                  else if (seat.grade === 'E') gradeColor = 'bg-sky-200 hover:bg-sky-300';
                  else if (seat.grade === 'N/S') gradeColor = 'bg-gray-300 hover:bg-gray-400';

                  return (
                    <button key={seat.id} onClick={() => handleSelectSeat(seat)} disabled={seat.status === 'taken'}
                      className={`aspect-square text-[10px] rounded ${seat.status === 'taken' ? 'bg-muted text-muted-foreground cursor-not-allowed' : gradeColor} ${isSelected ? '!bg-primary !text-primary-foreground' : ''}`}>
                      {seat.id}
                    </button>
                  )
                })}
              </div>
               {/* --- 등급 범례 추가 --- */}
              <div className="flex justify-center gap-4 mt-6 text-sm">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-200"></div>W석</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-200"></div>E석</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-gray-300"></div>N/S석</div>
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
                            <p><strong>경기:</strong> K League 1 - 라이벌 매치</p>
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
