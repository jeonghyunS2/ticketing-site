"use client"; // 상호작용을 위해 클라이언트 컴포넌트로 전환합니다.

// 'Theater' 아이콘이 존재하지 않아 'Drama'로 변경했습니다.
import { Music, Gamepad, Trophy} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// 각 카테고리에 href(이동할 경로) 속성을 추가합니다.
const categories = [
  {
    icon: Music,
    title: "콘서트",
    description: "K-POP",
    count: "1개",
    href: "/event/iu-concert", // 콘서트 페이지 경로
  },
  {
    icon: Gamepad, // 'Theater'를 'Drama' 아이콘으로 수정했습니다.
    title: "E-sports",
    description: "LCK - LE CLASSICO",
    count: "1개",
    href: "/booking/lck-match", // 뮤지컬 페이지 경로
  },
  {
    icon: Trophy,
    title: "스포츠",
    description: "축구",
    count: "1개",
    href: "/event/fc-seoul-vs-jeonbuk", // 스포츠 페이지 경로
  }
];

export default function Categories() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">카테고리별 탐색</h2>
          <p className="text-lg text-muted-foreground">원하는 공연을 쉽게 찾아보세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              // Card를 a 태그로 감싸서 전체를 클릭 가능한 링크로 만듭니다.
              <a key={index} href={category.href} className="block group">
                <Card className="hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1 flex-grow">{category.description}</p>
                    <p className="text-xs text-primary font-medium">{category.count}</p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

