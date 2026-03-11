"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import CartItem from "./cart-item";
import { CART_GRID } from "./cart-constants";

interface CartItemData {
  id: string;
  image: string;
  category: string;
  name: string;
  price: number;
  quantity: number;
  shipping: number;
  checked: boolean;
}

interface CartItemListProps {
  items: CartItemData[];
  allChecked: boolean;
  onToggleAll: () => void;
  onToggleItem: (id: string) => void;
  onDeleteAll: () => void;
  onDeleteSelected: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export default function CartItemList({
  items,
  allChecked,
  onToggleAll,
  onToggleItem,
  onDeleteAll,
  onDeleteSelected,
  onQuantityChange,
}: CartItemListProps) {
  return (
    <div className="flex-1">
      <div className="border-y border-gray-300">
        {/* 헤더 */}
        <div className={`grid ${CART_GRID} h-[80px] border-b border-gray-300`}>
          <div className="flex items-center gap-3 px-6">
            <Checkbox
              variant="checkbox02"
              checkboxSize="sm"
              checked={allChecked}
              onChange={onToggleAll}
            />
            <span className="text-[20px] font-[400] text-gray-900">상품정보</span>
          </div>
          <div className="flex items-center justify-center border-l border-gray-300 text-[20px] font-[400] text-gray-900">
            수량
          </div>
          <div className="flex items-center justify-center border-l border-gray-300 text-[20px] font-[400] text-gray-900">
            주문 금액
          </div>
          <div className="flex items-center justify-center border-l border-gray-300 text-[20px] font-[400] text-gray-900">
            배송 정보
          </div>
        </div>

        {/* 아이템 */}
        {items.map((item) => (
          <CartItem
            key={item.id}
            {...item}
            onToggle={onToggleItem}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onDeleteAll}
          className="w-[139px] h-[50px] px-[18px] py-[12px] rounded-full border border-gray-200 bg-transparent text-sm text-gray-500 hover:bg-gray-50"
        >
          전체 상품 삭제
        </button>
        <button
          onClick={onDeleteSelected}
          className="w-[139px] h-[50px] px-[18px] py-[12px] rounded-full border border-gray-200 bg-transparent text-sm text-gray-500 hover:bg-gray-50"
        >
          선택 상품 삭제
        </button>
      </div>
    </div>
  );
}