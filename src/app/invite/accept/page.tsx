"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

import { FullWidthCenterHeader } from "@/components/header"

/**
 * 초대 메일에서 열리는 진입 URL: `/invite/accept?token=…`
 * 실제 가입 폼은 `/invitations/signup`에서 동일 쿼리로 처리합니다.
 */
function InviteAcceptContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""

  useEffect(() => {
    if (!token) return
    router.replace(`/invitations/signup?${searchParams.toString()}`)
  }, [router, searchParams, token])

  if (!token) {
    return (
      <main className="relative min-h-screen bg-white px-6 pb-12 pt-[86px] md:pt-[96px] lg:pt-[120px]">
        <FullWidthCenterHeader
          className="absolute left-0 top-0 z-10"
          logoHref="/"
        />
        <section className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-6">
          <h1 className="text_2xl_semibold black_black_500_t">초대 링크</h1>
          <p className="text_sm_medium text-[#F97B22]" role="alert">
            링크에 초대 토큰이 없습니다. 메일에 있는 주소 전체를 다시
            열어 주세요.
          </p>
          <Link
            href="/login"
            className="text_sm_semibold text-[#F97B22] underline underline-offset-2"
          >
            로그인으로 이동
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-white px-6 pb-12 pt-[86px] md:pt-[96px] lg:pt-[120px]">
      <FullWidthCenterHeader
        className="absolute left-0 top-0 z-10"
        logoHref="/"
      />
      <section className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-6">
        <h1 className="text_2xl_semibold black_black_500_t">초대 수락</h1>
        <p className="text_sm_medium gray_gray_500_t">회원가입 페이지로 이동 중…</p>
      </section>
    </main>
  )
}

export default function InviteAcceptPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen bg-white px-6 pb-12 pt-[86px] md:pt-[96px] lg:pt-[120px]">
          <FullWidthCenterHeader
            className="absolute left-0 top-0 z-10"
            logoHref="/"
          />
          <section className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-6">
            <h1 className="text_2xl_semibold black_black_500_t">초대 수락</h1>
            <p className="text_sm_medium gray_gray_500_t">불러오는 중…</p>
          </section>
        </main>
      }
    >
      <InviteAcceptContent />
    </Suspense>
  )
}
