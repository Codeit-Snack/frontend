"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"

import { AuthGnb } from "@/components/auth/auth-gnb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fieldWrapperClass =
  "flex min-h-[86px] w-full max-w-[327px] flex-col items-start gap-2 self-stretch md:min-h-[112px] md:max-w-[640px] md:gap-4"
const inputClass =
  "h-[54px] w-full rounded-[16px] text-sm md:h-[64px] md:text-[20px]"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const showPasswordRequired =
    (passwordFocused || submitted) && password.trim().length === 0
  const showPasswordMismatch =
    passwordConfirm.length > 0 && password !== passwordConfirm
  const canSubmit =
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    passwordConfirm.trim().length > 0 &&
    password === passwordConfirm

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    if (!canSubmit) return

    // TODO: connect signup API
    window.alert("가입 조건이 충족되었습니다.")
  }

  return (
    <main className="relative min-h-screen bg-white px-6 pb-12 pt-[86px] md:pt-[96px] lg:pt-[120px]">
      <AuthGnb />
      <section className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-6">
        <h1 className="text_2xl_semibold black_black_500_t">회원가입</h1>

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
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력해 주세요"
              variant="outlined"
              inputSize="md"
              className={`${inputClass} ${
                passwordFocused || password.trim().length > 0 || showPasswordRequired
                  ? "border-[#F97B22] focus-visible:border-[#F97B22] focus-visible:ring-0"
                  : ""
              }`}
              autoComplete="new-password"
              value={password}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {showPasswordRequired && (
              <p className="text_sm_medium text-[#F97B22]">비밀번호를 입력해주세요</p>
            )}
          </div>

          <div className={fieldWrapperClass}>
            <label
              htmlFor="passwordConfirm"
              className="text_lg_medium black_black_400_t"
            >
              비밀번호 확인
            </label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              variant="outlined"
              inputSize="md"
              className={inputClass}
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
            />
            {showPasswordMismatch && (
              <p className="text_sm_medium text-[#F97B22]">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="solid"
            size="lg"
            disabled={!canSubmit}
            className="h-[54px] w-full max-w-[327px] disabled:cursor-not-allowed disabled:opacity-60 md:h-[64px] md:max-w-[640px]"
          >
            시작하기
          </Button>
        </form>
        <p className="w-full max-w-[327px] text-center text_xs_regular gray_gray_500_t md:max-w-[640px]">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text_xs_semibold primary_orange_400_t">
            로그인
          </Link>
        </p>
      </section>
    </main>
  )
}
