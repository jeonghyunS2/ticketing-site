// app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation"; // useRouter 추가
import { useEffect, useState, Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Button 추가
import { Star, Calendar, MapPin } from "lucide-react";

// 이벤트 객체 타입과 더미 데이터는 기존과 동일
interface EventItem {
  id: number;
  title: string;
  artist: string;
  date: string;
  venue: string;
  image: string;
  rating: number;
  category: string;
}

const allEvents: EventItem[] = [
  {
    id: 1,
    title: "아이유 2024 콘서트 'HEREH'",
    artist: "아이유",
    date: "2024.04.15",
    venue: "KSPO DOME",
    image: "/iu-concert-stage-with-soft-lighting.jpg",
    rating: 4.9,
    category: "콘서트",
  },
  {
    id: 2,
    title: "2025 LCK Summer Playoffs R1",
    artist: "T1 vs Gen.G",
    date: "2025.09.20",
    venue: "롤파크(LoL PARK)",
    image: "/t1vsgeng.jpg",
    rating: 4.8,
    category: "e스포츠",
  },
  {
    id: 3,
    title: "FC 서울 vs 전북 현대",
    artist: "K리그1",
    date: "2024.04.25",
    venue: "서울월드컵경기장",
    image: "/soccer-match-at-night-stadium-with-crowd.jpg",
    rating: 4.6,
    category: "스포츠",
  }
];

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter(); // ⭐️ useRouter 인스턴스 생성
  const searchQuery = searchParams.get("query") || "";
  
  const [results, setResults] = useState<EventItem[]>([]);

  useEffect(() => {
    if (searchQuery) {
      const filteredResults = allEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  // ⭐️ 메인 화면으로 돌아가는 함수
  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">
        검색 결과: <span className="text-primary">'{searchQuery}'</span>
      </h1>

      {searchQuery && results.length > 0 ? (
        <div className="flex flex-col gap-6">
          {results.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col md:flex-row">
              <div className="aspect-video w-full md:w-1/3 relative overflow-hidden flex-shrink-0">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{event.rating}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-muted-foreground mb-4">{event.artist}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center mt-12 space-y-4">
          <p className="text-lg text-muted-foreground">
            {searchQuery ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : '검색어를 입력해 주세요.'}
          </p>
          {searchQuery && (
            <Button onClick={handleGoHome}>
              메인으로 돌아가기
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Suspense fallback={<div>검색 결과를 불러오는 중...</div>}>
        <SearchResults />
      </Suspense>
    </main>
  );
}