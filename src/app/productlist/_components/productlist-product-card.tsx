"use client"

import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import type { Product } from "../_lib/types"

/** 상품 리스트 전용: 공용 ProductCard는 고정 327px 유지, 그리드 셀에 맞춘 반응형 카드 */
export function ProductListProductCard({
  product,
  className,
  ...props
}: { product: Product } & ComponentProps<"div">) {
  const { image, category, purchaseCount, name, price } = product
  return (
    <div
      data-slot="productlist-product-card"
      className={cn(
        "w-full min-w-0 overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        {image ? (
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
      </div>

      <div className="p-3 lg:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs text-gray-500 lg:text-sm">{category}</span>
          <span className="shrink-0 rounded-full bg-[#FDF0DF] px-2 py-0.5 text-[10px] font-medium text-[#E5762C] lg:px-3 lg:py-1 lg:text-xs">
            {purchaseCount}회 구매
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 lg:text-base">{name}</h3>

        <p className="text-lg font-bold text-gray-900 lg:text-xl">{price.toLocaleString()}원</p>
      </div>
    </div>
  )
}
