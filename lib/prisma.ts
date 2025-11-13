// lib/prisma.ts

import { PrismaClient } from '@prisma/client'

declare global {
  // var 키워드를 사용하는 것이 Next.js의 핫 리로드에서 충돌 방지에 효과적
  var prisma: PrismaClient | undefined
}

// 전역 객체에 Prisma 클라이언트가 없으면 새로 생성 (단 한번만)
const prisma = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Prisma 쿼리 로그 활성화 (디버깅용)
})

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma