import { Calendar, MapPin, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    id: 1,
    title: "아이유 2024 콘서트 'HEREH'",
    artist: "아이유",
    date: "2024.04.15",
    time: "19:00",
    venue: "KSPO DOME",
    location: "서울",
    price: "99,000원부터",
    image: "/iu-concert-stage-with-soft-lighting.jpg",
    rating: 4.9,
    category: "콘서트",
    status: "예매중",
    bookingHref: "/event/iu-concert",
  },
  {
    id: 2,
    title: "2025 LCK Summer Playoffs R1",
    artist: "T1 vs Gen.G", 
    date: "2025.09.20",
    time: "17:00",
    venue: "롤파크(LoL PARK)",
    location: "서울",
    price: "20,000원부터",
    image: "/t1vsgeng.jpg",
    rating: 4.8,
    category: "e스포츠",
    status: "예매중",
    bookingHref: "/booking/lck-match",
  },
  {
    id: 3,
    title: "FC 서울 vs 전북 현대",
    artist: "K리그1",
    date: "2024.04.25",
    time: "19:30",
    venue: "서울월드컵경기장",
    location: "서울",
    price: "15,000원부터",
    image: "/soccer-match-at-night-stadium-with-crowd.jpg",
    rating: 4.6,
    category: "스포츠",
    status: "예매중",
    bookingHref: "/event/fc-seoul-vs-jeonbuk",
  }
]

export function EventGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">인기 공연</h2>
            <p className="text-lg text-muted-foreground">지금 가장 핫한 공연들을 만나보세요</p>
          </div>
          <Button variant="outline">전체보기</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive">{event.status}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
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
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-accent">{event.price}</span>
                    <span className="text-sm text-muted-foreground">{event.location}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                {/* asChild 속성을 추가하고 a 태그로 감싸서 링크 기능을 부여합니다. */}
                <Button asChild className="w-full" size="lg">
                  <a href={event.bookingHref}>예매하기</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}