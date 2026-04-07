// src/app/budget-mng/_components/budget-form.tsx

"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function formatWithComma(value: string): string {
  const digits = value.replace(/\D/g, "")
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function parseDigits(value: string): string {
  return value.replace(/\D/g, "")
}

type BudgetFormSize = "md" | "sm"

export const BudgetForm = ({
  className,
  size = "md",
  onSubmit: onSubmitProp,
  ...props
}: React.ComponentProps<"form"> & { size?: BudgetFormSize }) => {
  const [budgetValue, setBudgetValue] = React.useState("")
  const [startBudgetValue, setStartBudgetValue] = React.useState("")

  const isSm = size === "sm"
  const inputSizeClass = isSm ? "h-[54px] w-full text-sm" : "h-[64px] w-full text-base"
  const activeInputClass =
    "border-2 border-[#F97B22] rounded-[16px] focus:border-[#F97B22] focus-visible:border-[#F97B22]"

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmitProp?.(e)
  }

  return (
    <form
      className={cn("flex w-full flex-col items-center", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      <section className="w-full border-y border-[#D9D9D9] py-8">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <label htmlFor="monthly-budget" className="w-full text-sm font-medium">
              월별 예산 선택(선택하지 않으면 이번 달 예산 적용)
            </label>
            <div className="flex flex-col gap-4">
              <Input id="date-range" placeholder="2026.01"></Input><Image src="/icons/calendar.svg" alt="calendar" width={24} height={24} />
            </div>
            <Input
              id="monthly-budget"
              placeholder="3,500,000"
              value={formatWithComma(budgetValue)}
              onChange={(e) => setBudgetValue(parseDigits(e.target.value))}
              className={cn(inputSizeClass, budgetValue.trim() && activeInputClass)}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label htmlFor="start-monthly-budget" className="w-full text-sm font-medium">
              매달 시작 예산
            </label>
            <Input
              id="start-monthly-budget"
              placeholder="3,000,000"
              value={formatWithComma(startBudgetValue)}
              onChange={(e) => setStartBudgetValue(parseDigits(e.target.value))}
              className={cn(inputSizeClass, startBudgetValue.trim() && activeInputClass)}
            />
          </div>
        </div>
      </section>
      <div className="w-full pt-8">
        <Button
          type="submit"
          size={isSm ? "sm" : "lg"}
          className={cn("w-full", isSm ? "h-[54px]" : "h-[64px]")}
        >
          수정하기
        </Button>
      </div>
    </form>
  )
}