"use client"

import { LoginForm } from "@/components/ui/molecules/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-semibold text-center">로그인</h1>
        <LoginForm
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: API 연동 시 로그인 요청
          }}
        />
      </div>
    </div>
  )
}
