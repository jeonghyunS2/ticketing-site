// app/admin/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const mockEvents = [
  { id: 'iu-concert', title: '아이유 콘서트', date: '2024.04.10', venue: 'KSPO DOME' },
  { id: 'lck-match', title: 'LCK Summer Playoffs', date: '2025.09.20', venue: 'LoL PARK' },
  { id: 'k-league', title: 'FC 서울 vs 전북', date: '2025.10.05', venue: '서울월드컵경기장' },
];

export default function AdminDashboardPage() {
    // 여기에 나중에 공연 추가/삭제 기능 등을 넣을 수 있습니다.
    const [events, setEvents] = useState(mockEvents);

    return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">공연 관리</h1>
            <Button>새 공연 추가</Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>공연명</TableHead>
                  <TableHead>장소</TableHead>
                  <TableHead>날짜</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.venue}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">수정</Button>
                      <Button variant="destructive" size="sm">삭제</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      );
}