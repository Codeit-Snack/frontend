import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductListAddProductButtonProps {
  onClick?: () => void
}

export function ProductListAddProductButton({ onClick }: ProductListAddProductButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed bottom-[120px] right-[120px]",
        "flex h-12 w-28 items-center justify-center rounded-full",
        "bg-[var(--secondary-illustration-06)] text-white shadow-lg",
        "transition-transform hover:translate-y-[-2px] hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--secondary-illustration-06)]"
      )}
      aria-label="상품 등록"
    >
      <Plus className="h-5 w-5" aria-hidden="true" />
      <span className="text-base font-semibold">상품 등록</span>
    </button>
  )
}

