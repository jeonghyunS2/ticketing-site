"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// 가짜(mock) 입금 내역 데이터
const mockPayments = [
  { id: 'pay001', event: 'LCK Summer Playoffs', userName: '홍길동', amount: 70000, method: '무통장입금', date: '2025-09-15', status: '입금완료' },
  { id: 'pay002', event: '아이유 콘서트', userName: '이순신', amount: 165000, method: '신용카드', date: '2025-09-16', status: '결제완료' },
  { id: 'pay003', event: 'FC 서울 vs 전북', userName: '유관순', amount: 30000, method: '무통장입금', date: '2025-09-17', status: '입금대기' },
  { id: 'pay004', event: 'LCK Summer Playoffs', userName: '세종대왕', amount: 140000, method: '간편결제', date: '2025-09-18', status: '결제완료' },
];

export default function PaymentHistoryPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">입금내역 확인</h1>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>공연명</TableHead>
              <TableHead>예매자</TableHead>
              <TableHead>결제 금액</TableHead>
              <TableHead>결제 수단</TableHead>
              <TableHead>결제일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.event}</TableCell>
                <TableCell>{payment.userName}</TableCell>
                <TableCell>{payment.amount.toLocaleString()}원</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      payment.status === '입금대기' ? 'secondary' : 
                      payment.status === '입금완료' ? 'default' :
                      payment.status === '결제완료' ? 'default' :
                      'outline'
                    }
                  >
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

