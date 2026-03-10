"use client";

import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CART_GRID } from "./cart-constants";

interface CartItemProps {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  shipping: number;
  checked: boolean;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onQuantityChange?: (id: string, quantity: number) => void;
}

export default function CartItem({
  id,
  image,
  name,
  price,
  quantity,
  shipping,
  checked,
  onToggle,
  onDelete,
  onQuantityChange,
}: CartItemProps) {
  return (
    <div className={`grid ${CART_GRID} h-[208px] border-b border-gray-300 last:border-b-0`}>
      {/* 상품 정보 */}
      <div className="flex items-center gap-6 px-6 py-6">
        <Checkbox
          variant="checkbox02"
          checkboxSize="sm"
          checked={checked}
          onChange={() => onToggle(id)}
        />
        <div className="w-[160px] h-[160px] flex-shrink-0 rounded-[8px] border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <p className="text-xs text-gray-400 text-center px-2">{name}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
          <p className="text-[20px] font-[400] text-gray-900 truncate">{name}</p>
          <p className="text-[24px] font-[700] text-gray-900">{price.toLocaleString()}원</p>
        </div>
        <button
          onClick={() => onDelete?.(id)}
          className="flex-shrink-0 self-start w-[36px] h-[36px] flex items-center justify-center"
        >
          <X size={36} className="text-gray-400 hover:text-gray-700" />
        </button>
      </div>

      {/* 수량 */}
      <div className="flex items-center justify-center border-l border-gray-300">
        <div className="flex items-center h-[54px] w-[160px] rounded-[16px] border border-orange-300 bg-gray-50 px-[14px]">
          <span className="flex-1 text-right text-[18px] font-[400] text-[#E5762C] pr-1">{quantity}</span>
          <span className="text-[#E5762C] text-[18px] font-[400] pr-1">개</span>
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => onQuantityChange?.(id, quantity + 1)}
              className="flex items-center justify-center text-[#E5762C] hover:text-[#d06820]"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                <path d="M5 0L10 6H0L5 0Z"/>
              </svg>
            </button>
            <button
              onClick={() => onQuantityChange?.(id, Math.max(1, quantity - 1))}
              className="flex items-center justify-center text-[#E5762C] hover:text-[#d06820]"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                <path d="M5 6L0 0H10L5 6Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 주문 금액 */}
      <div className="flex flex-col items-center justify-center gap-5 border-l border-gray-300">
        <p className="text-[24px] font-[700] text-gray-900">
          {(price * quantity).toLocaleString()}원
        </p>
        <Button 
          variant="solid" 
          className="text-[18px] font-[600] px-8 py-3 rounded-full h-auto w-auto"
        >
          즉시 요청
        </Button>
      </div>

      {/* 배송 정보 */}
      <div className="flex flex-col items-center justify-center gap-2 border-l border-gray-300">
        <p className="text-[20px] font-[700] text-gray-900">{shipping.toLocaleString()}원</p>
        <p className="text-[20px] font-[400] text-gray-400">택배 배송</p>
      </div>
    </div>
  );
}