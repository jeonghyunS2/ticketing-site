// components/footer.tsx
'use client';

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"; // Link를 사용하기 위해 import 합니다.

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">TicketHub</h3>
            <p className="text-primary-foreground/80 mb-4">
              캡스톤디자인 하시는 대학생분들 화이팅입니다.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <a href="/event/iu-concert" className="hover:text-primary-foreground transition-colors">
                  콘서트
                </a>
              </li>
              <li>
                <a href="/booking/lck-match" className="hover:text-primary-foreground transition-colors">
                  E-sports
                </a>
              </li>
              <li>
                <a href="/event/fc-seoul-vs-jeonbuk" className="hover:text-primary-foreground transition-colors">
                  스포츠
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">고객센터</h4>
            <ul className="space-y-2 text-primary-foreground/80">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">공지사항</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">1:1 문의</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">예매 가이드</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">취소/환불</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p>고객센터: 010-9155-0549</p>
              <p>운영시간: 09:00 - 18:00</p>
              <p>이메일: parksungwuu@naver.com</p>
              <p>주소: 충청남도 아산시 탕정면 선문로221번길 70 선문대학교 공학관 5층 509호</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-primary-foreground/60 text-sm">
                <p>© 2024 TicketHub. All rights reserved.</p>
                {/* --- 관리자 페이지로 가는 임시 링크 추가 --- */}
                <Link 
                    href="/admin" 
                    className="text-xs underline underline-offset-4 hover:text-primary-foreground"
                    target="_blank"
                >
                    Admin Page
                </Link>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">이용약관</a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">개인정보처리방침</a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">사업자정보</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}