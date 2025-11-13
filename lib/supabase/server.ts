import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 이 함수는 사용자 세션을 처리하며 올바르게 작성되어 있습니다.
export function createSupabaseServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

// 이 관리자용 함수가 오류의 원인이었습니다.
export function createSupabaseAdminClient() {
    const cookieStore = cookies() // 쿠키 저장소를 가져오는 부분이 필요합니다.

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!,
        {
            // 이 부분에 쿠키 처리 함수들이 빠져 있었습니다.
            cookies: {
                get(name: string) {
                  return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                  cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                  cookieStore.set({ name, value: '', ...options })
                },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}