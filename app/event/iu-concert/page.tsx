"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

// --- [좌석 및 가격 정의] ---
type SeatGrade = 'R' | 'S' | 'A';

const PRICES: Record<SeatGrade, number> = {
    'R': 165000,
    'S': 154000,
    'A': 132000,
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

const MAX_SELECTION = 2; // 콘서트는 1인당 2매로 제한
const CONCERT_TITLE = "2024 IU H.E.R. World Tour Concert";

export default function IuConcertBookingPage() {
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
            let grade: SeatGrade;
            if (rowIndex < 3) grade = 'R';       // A, B, C열은 R석
            else if (rowIndex < 7) grade = 'S';  // D, E, F, G열은 S석
            else grade = 'A';                    // H, I, J열은 A석

            for (let i = 1; i <= 10; i++) {
                newSeats.push({
                    id: `${row}${i}`,
                    status: Math.random() > 0.6 ? 'taken' : 'available',
                    grade: grade,
                });
            }
        });
        setSeats(newSeats);
    }, []);

    // --- 이벤트 핸들러 ---
    const handlePaymentChange = (value: string) => {
        setPaymentMethod(value);
        if (value === "bank_transfer") {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 24);
            setBankAccount({
                bankName: "카카오뱅크",
                accountNumber: `3333-${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 9000000) + 1000000}`,
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

    // 🌟🌟🌟 DB 관련 로직 제거, 오직 로컬 저장소만 사용하는 최초의 상태로 복원 🌟🌟🌟
    const handleConfirmBooking = () => {
        const newBooking = {
            id: Date.now(),
            title: CONCERT_TITLE,
            match: "아이유 콘서트",
            date: "2024년 4월 10일 (수)",
            seats: selectedSeats.map(s => `${s.id}(${s.grade}석)`).join(', '),
            totalPrice: totalPrice, // 동적으로 계산된 최종 가격 사용
            paymentMethod: paymentMethod,
            bankAccount: paymentMethod === 'bank_transfer' ? bankAccount : null,
            poster: "/iu-concert.png",
        };

        // 서버 통신 시도 코드 모두 제거됨
        
        const existingBookings = JSON.parse(localStorage.getItem("my_bookings") || "[]");
        existingBookings.push(newBooking);
        localStorage.setItem("my_bookings", JSON.stringify(existingBookings));

        let confirmationMessage = `${selectedSeats.map(s => s.id).join(', ')}석 예매가 완료되었습니다!`;
        if (newBooking.bankAccount) {
            confirmationMessage += `\n\n입금 계좌: ${newBooking.bankAccount.bankName} ${newBooking.bankAccount.accountNumber}\n입금 기한: ${newBooking.bankAccount.expires} 까지`;
        }
        alert(confirmationMessage); // 이 알림만 뜨고, 오류 알림은 뜨지 않습니다.

        setIsPaymentModalOpen(false);
        setSelectedSeats([]);
    };
    // 🌟🌟🌟 복원 완료 🌟🌟🌟

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
                <h1 className="text-3xl font-bold mb-4">공연 상세 및 예매</h1>
                <Separator className="mb-8" />
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                        <img src="/iu-concert.png" alt="IU Concert Poster" className="rounded-lg shadow-lg w-full" />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h2 className="text-4xl font-extrabold">2024 IU H.E.R. World Tour Concert</h2>
                        <p className="text-lg text-muted-foreground mt-2">아이유 콘서트</p>
                        <Separator className="my-6" />
                        <div className="space-y-4 text-base">
                            <p><strong>🗓️ 날짜:</strong> 2024년 4월 10일 (수)</p>
                            <p><strong>📍 장소:</strong> KSPO DOME (올림픽체조경기장)</p>
                            <p><strong>👤 관람 등급:</strong> 8세 이상 관람가</p>
                        </div>
                        <Card className="mt-8">
                            <CardHeader><CardTitle>좌석 및 가격</CardTitle></CardHeader>
                            <CardContent>
                                <img src="/kspo-seatmap.png" alt="KSPO Dome Seatmap" className="rounded-md w-full mb-6 border" />
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">R석</span><span className="text-lg font-bold">165,000원</span></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">S석</span><span className="text-lg font-bold">154,000원</span></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold text-lg">A석</span><span className="text-lg font-bold">132,000원</span></div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-8">
                                    <Button variant="outline" onClick={() => alert("장바구니 로직을 구현해야 합니다.")}>장바구니 담기</Button>
                                    <Button onClick={() => setIsSeatModalOpen(true)}>좌석 선택하기</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* --- 1. 좌석 선택 모달 --- */}
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
                                    if (seat.grade === 'R') gradeColor = 'bg-red-200 hover:bg-red-300';
                                    else if (seat.grade === 'S') gradeColor = 'bg-blue-200 hover:bg-blue-300';
                                    else if (seat.grade === 'A') gradeColor = 'bg-green-200 hover:bg-green-300';

                                    return (
                                        <button key={seat.id} onClick={() => handleSelectSeat(seat)} disabled={seat.status === 'taken'}
                                            className={`aspect-square text-xs rounded ${seat.status === 'taken' ? 'bg-muted text-muted-foreground cursor-not-allowed' : gradeColor} ${isSelected ? '!bg-primary !text-primary-foreground' : ''}`}>
                                            {seat.id}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="flex justify-center gap-4 mt-6 text-sm">
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-200"></div>R석</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-blue-200"></div>S석</div>
                                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-200"></div>A석</div>
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

            {/* --- 2. 결제 모달 --- */}
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
                                    <p><strong>공연:</strong> {CONCERT_TITLE}</p>
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