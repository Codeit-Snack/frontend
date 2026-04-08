"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"

import { FullWidthCenterHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

const fieldWrapperClass =
  "flex min-h-[86px] w-full max-w-[327px] flex-col items-start gap-2 self-stretch md:min-h-[112px] md:max-w-[640px] md:gap-4"
const inputClass =
  "h-[54px] w-full rounded-[16px] text-sm md:h-[64px] md:text-[20px]"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const canSubmit = email.trim().length > 0 && password.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    // TODO: 로그인 API — 성공 시에만 이동
    router.push("/productlist")
  }

  return (
    <main className="relative min-h-screen bg-white px-6 pb-12 pt-[86px] md:pt-[96px] lg:pt-[120px]">
      <FullWidthCenterHeader className="absolute left-0 top-0 z-10" />
      <section className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-6">
        <h1 className="w-full text-center text_2xl_semibold black_black_500_t">
          로그인
        </h1>

        <form
          className="flex w-full flex-col items-start gap-8"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className={fieldWrapperClass}>
            <label htmlFor="email" className="text_lg_medium black_black_400_t">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              variant="outlined"
              inputSize="md"
              className={inputClass}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className={fieldWrapperClass}>
            <label htmlFor="password" className="text_lg_medium black_black_400_t">
              비밀번호
            </label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="비밀번호를 입력해 주세요"
              variant="outlined"
              inputSize="md"
              className={inputClass}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              toggleLabel="password"
              required
            />
          </div>

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={!canSubmit}
            className="h-[54px] w-full max-w-[327px] disabled:cursor-not-allowed disabled:opacity-60 md:h-[64px] md:max-w-[640px]"
          >
            로그인
          </Button>
        </form>

        <p className="text-center text_xs_regular gray_gray_500_t">
          기업담당자이신가요?{" "}
          <Link
            href="/signup/super-admin"
            className="text_xs_semibold text-[#F97B22] underline underline-offset-2"
          >
            가입하기
          </Link>
        </p>
      </section>
    </main>
  )
}
