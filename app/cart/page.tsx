// app/cart/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Minus, Plus } from "lucide-react";

// 장바구니 아이템 타입을 정의합니다.
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  poster: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 페이지 로드 시 localStorage에서 장바구니 데이터를 불러옵니다.
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("shopping_cart") || "[]");
    setCartItems(storedCart);
  }, []);

  // 로컬 스토리지와 state를 함께 업데이트하는 헬퍼 함수
  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    localStorage.setItem("shopping_cart", JSON.stringify(newCart));
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id: string, amount: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; // 수량은 최소 1
      }
      return item;
    });
    updateCart(newCart);
  };

  // 아이템 삭제 핸들러
  const handleRemoveItem = (id: string) => {
    if(confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) {
      const newCart = cartItems.filter(item => item.id !== id);
      updateCart(newCart);
    }
  };

  // 총 금액 계산
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <>
      <Header /> 
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold">장바구니</h1>
        </div>
        
        {cartItems.length === 0 ? (
          // 장바구니가 비어있을 때
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">장바구니에 담은 상품이 없습니다.</p>
            <Button asChild className="mt-6"><a href="/">공연 보러 가기</a></Button>
          </div>
        ) : (
          // 장바구니에 상품이 있을 때
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border p-4 rounded-lg shadow-sm">
                  <img src={item.poster} alt={item.title} className="w-24 h-32 object-cover rounded-md" />
                  <div className="flex-grow">
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="font-bold mt-2 text-lg">{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, -1)}><Minus className="h-4 w-4" /></Button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.id, 1)}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => handleRemoveItem(item.id)}><Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" /></Button>
                </div>
              ))}
            </div>
            
            <div className="md:col-span-1 sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>결제 예정 금액</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>총 상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-xl">
                    <span>총 결제 예정 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <Button className="w-full mt-4 text-lg h-12">결제하기</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}