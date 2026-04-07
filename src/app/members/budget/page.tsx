import { BudgetForm } from "@/app/budget-mng/_components/budget-form"

export default function MembersBudgetPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-4 py-10">
      <h1 className="mb-10 text-center text-[32px] font-bold">예산 관리</h1>
      <BudgetForm />
    </main>
  )
}
