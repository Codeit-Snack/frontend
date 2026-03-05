import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[16px] font-medium whitespace-nowrap transition-all outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Solid Button - 주황색 배경
        solid:
          "bg-[#E5762C] text-white hover:bg-[#D16825]",
        // Solid Selected - 연한 주황색 배경 + 연한 테두리
        "solid-selected":
          "bg-orange-300 text-white border-2 border-orange-200",
        // Solid Disabled - gray-50 배경
        "solid-disabled":
          "bg-gray-50 text-gray-400 cursor-not-allowed",
        // Outlined Button - 주황색 테두리 + 주황색 텍스트
        outlined:
          "bg-transparent text-[#E5762C] border-2 border-[#E5762C] hover:bg-orange-50",
        // Outlined Selected - 흰색 배경 + 주황색 테두리
        "outlined-selected":
          "bg-white text-[#E5762C] border-2 border-[#E5762C]",
        // Outlined Disabled - 회색 테두리 + 회색 텍스트
        "outlined-disabled":
          "bg-transparent text-gray-400 border border-gray-200 cursor-not-allowed",
      },
      size: {
        sm: "w-[327px] h-[54px] text-sm",
        lg: "w-[640px] h-[64px] text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "sm",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
