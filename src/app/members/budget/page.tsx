"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function MembersBudgetPage() {
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [startingBudget, setStartingBudget] = useState("");

  const activeInputClass =
    "rounded-[16px] border-2 border-[var(--primary-orange-400)] focus:border-[var(--primary-orange-400)] focus-visible:border-[var(--primary-orange-400)]";

  return (
    <main className="px-4 py-8 min-[745px]:px-8 min-[745px]:py-14">
      <section className="mx-auto flex w-full max-w-[640px] flex-col items-center">
        <h1 className="text-center text-[28px] font-bold leading-[1.3] text-[#37352F] min-[745px]:text-[32px]">
          예산 관리
        </h1>

        <form className="mt-10 w-full min-[745px]:mt-12">
          <section className="w-full border-y border-[#D9D9D9] py-8 min-[745px]:py-10">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="members-monthly-budget"
                  className="text-sm font-medium text-[#37352F]"
                >
                  이번 달 예산
                </label>
                <Input
                  id="members-monthly-budget"
                  placeholder="3,500,000"
                  value={monthlyBudget}
                  onChange={(event) => setMonthlyBudget(event.target.value)}
                  className={cn(
                    "h-[54px] w-full text-sm min-[745px]:h-[64px] min-[745px]:text-base",
                    monthlyBudget.trim() && activeInputClass,
                  )}
                />
              </div>

              <div className="flex flex-col gap-4">
                <label
                  htmlFor="members-starting-budget"
                  className="text-sm font-medium text-[#37352F]"
                >
                  매달 시작 예산
                </label>
                <Input
                  id="members-starting-budget"
                  placeholder="3,000,000"
                  value={startingBudget}
                  onChange={(event) => setStartingBudget(event.target.value)}
                  className={cn(
                    "h-[54px] w-full text-sm min-[745px]:h-[64px] min-[745px]:text-base",
                    startingBudget.trim() && activeInputClass,
                  )}
                />
              </div>
            </div>
          </section>

          <div className="pt-8">
            <Button
              type="submit"
              className="h-[54px] w-full text-sm min-[745px]:h-[64px] min-[745px]:text-base"
            >
              수정하기
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
