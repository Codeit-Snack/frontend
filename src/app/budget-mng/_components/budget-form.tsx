// src/components/ui/molecules/login-form/login-form.tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
              이번 달 예산
            </label>
            <Input
              id="monthly-budget"
              placeholder="3,500,000"
              value={budgetValue}
              onChange={(e) => {
                const next = e.target.value
                setBudgetValue(next)
              }}
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
              value={startBudgetValue}
              onChange={(e) => {
                const next = e.target.value
                setStartBudgetValue(next)
              }}
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