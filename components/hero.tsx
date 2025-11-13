"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// 각 공연 정보를 담는 데이터 배열
const featuredEvents = [
  {
    title: "아이유 콘서트",
    date: "2024.04.10",
    venue: "KSPO DOME",
    image: "/iu-concert.png", 
    href: "/event/iu-concert", // 이 링크는 아직 만들지 않았으므로 동작하지 않습니다.
  },
  // --- 이 부분이 수정되었습니다 ---
  {
    title: "LCK  Playoffs",
    date: "2025.09.20",
    venue: "LoL PARK",
    image: "/t1vsgeng.jpg", // LCK 포스터 이미지 경로
    href: "/booking/lck-match",  // 이전에 만든 LCK 예매 페이지 경로
  },
  // --- 여기까지 수정되었습니다 ---
  {
    title: "FC 서울 vs 전북",
    date: "2024.03.25",
    venue: "서울월드컵경기장",
    image: "/soccer-stadium-crowd.png",
    href: "/event/fc-seoul-vs-jeonbuk", // 이 링크는 아직 만들지 않았으므로 동작하지 않습니다.
  },
];

export default function Hero() {
  const handleViewConcerts = () => {
    alert("인기 공연 목록 페이지로 이동합니다.");
    // window.location.href = '/concerts';
  };

  const handleExploreCategories = () => {
    alert("카테고리 페이지로 이동합니다.");
    // window.location.href = '/categories';
  };

  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
      <div className="container mx-auto px-4">
        {/* 상단 제목 및 버튼 */}
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            특별한 순간을 위한
            <br />
            완벽한 티켓
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 text-pretty">
            콘서트, 뮤지컬, 스포츠, 전시까지 모든 공연의 티켓을 한 곳에서
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={handleViewConcerts}>
              인기 공연 보기
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent" onClick={handleExploreCategories}>
              카테고리 탐색
            </Button>
          </div>
        </div>

        {/* 추천 공연 미리보기 */}
        <div className="container mx-auto px-4 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredEvents.map((event, index) => (
              <a key={index} href={event.href} className="block group">
                <Card className="overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="aspect-video relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/64748b/white?text=Image+Not+Found' }}
                    />
                  </div>
                  <CardContent className="p-4 bg-background text-foreground">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">{event.date}</p>
                    <p className="text-muted-foreground text-sm">{event.venue}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}