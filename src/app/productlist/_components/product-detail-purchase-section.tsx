"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** 목업: 결제 예정 금액의 1%를 적립 포인트로 표시 */
const POINT_RATE = 0.01

interface ProductDetailPurchaseSectionProps {
  productName: string
  unitPrice: number
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-gray-100 py-3 text-sm last:border-b-0">
      <span className="w-24 shrink-0 font-medium text-gray-500">{label}</span>
      <div className="min-w-0 flex-1 text-gray-800">{children}</div>
    </div>
  )
}

export function ProductDetailPurchaseSection({ productName, unitPrice }: ProductDetailPurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [cartMessage, setCartMessage] = useState<string | null>(null)

  const lineTotal = unitPrice * quantity
  const expectedPoints = Math.floor(lineTotal * POINT_RATE)

  const bump = (delta: number) => {
    setQuantity((q) => Math.min(99, Math.max(1, q + delta)))
    setCartMessage(null)
  }

  const handleAddToCart = () => {
    setCartMessage(
      `장바구니에 담았습니다 (목업): ${productName} × ${quantity}개 — 합계 ${lineTotal.toLocaleString()}원`,
    )
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-5 py-1">
        <DetailRow label="구매혜택">
          <span className="font-semibold text-[var(--primary-orange-400,#E5762C)]">
            {expectedPoints.toLocaleString()}포인트
          </span>{" "}
          적립 예정
        </DetailRow>
        <DetailRow label="배송방법">택배</DetailRow>
        <DetailRow label="배송비">
          3,000원 (50,000원 이상 구매 시 무료배송)
          <span className="mx-1.5 text-gray-400">|</span>
          도서산간 배송비 추가
        </DetailRow>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className={cn(
          "flex h-12 w-full shrink-0 items-center justify-between rounded-xl border border-gray-200 bg-white px-4 sm:w-[120px]"
        )}>
          <span className="text-sm font-bold text-[#E5762C]">
            {quantity}개
          </span>
          

          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              aria-label="수량 증가"
              className="flex h-5 w-6 items-center justify-center text-[#E5762C] hover:opacity-70 disabled:opacity-30 transition-opacity"
              disabled={quantity >= 99}
              onClick={() => bump(1)}
            >
              <ChevronUp className="size-4" strokeWidth={3} />
            </button>
            <button
              type="button"
              aria-label="수량 감소"
              className="flex h-5 w-6 items-center justify-center text-[#E5762C] hover:opacity-70 disabled:opacity-30 transition-opacity"
              disabled={quantity <= 1}
              onClick={() => bump(-1)}
            >
              <ChevronDown className="size-4" strokeWidth={3} />
            </button>
          </div>
        </div>
        
        <Button
          type="button"
          variant="solid"
          className="h-12 min-w-0 flex-1 rounded-2xl px-6 text-base font-semibold sm:w-auto sm:min-w-[200px]"
          onClick={handleAddToCart}
        >
          장바구니 담기
        </Button>
      </div>
      <div className="flex justify-between border-t border-gray-100 pt-4">
        <span className="text-base font-medium text-gray-900">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900">{lineTotal.toLocaleString()}원</span>
      </div>
      {cartMessage ? (
        <p className="text-sm text-gray-600" role="status">
          {cartMessage}
        </p>
      ) : null}
    </div>
  )
}
