"use client";

import { useState } from "react";
import CartItemList from "@/components/cart/cart-item-list";
import CartSummary from "@/components/cart/cart-summary";
import type { RequestItem } from "@/components/ui/dialog";
import { Header } from "@/components/header";

const DUMMY_ITEMS = [
  { id: "1", image: "", category: "음료", name: "코카콜라 제로", price: 2000, quantity: 1, shipping: 3000, checked: true },
  { id: "2", image: "", category: "음료", name: "칠성 사이다", price: 2000, quantity: 1, shipping: 3000, checked: true },
  { id: "3", image: "", category: "음료", name: "오렌지주스", price: 2000, quantity: 1, shipping: 3000, checked: true },
  { id: "4", image: "", category: "음료", name: "트레비", price: 2000, quantity: 1, shipping: 3000, checked: true },
];

export default function CartPage() {
  const [items, setItems] = useState(DUMMY_ITEMS);

  const allChecked = items.every((item) => item.checked);
  const checkedItems = items.filter((item) => item.checked);
  const totalProductPrice = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalShipping = checkedItems.reduce((sum, item) => sum + item.shipping, 0);
  const totalPrice = totalProductPrice + totalShipping;
  const totalCount = checkedItems.reduce((sum, item) => sum + item.quantity, 0);

  const requestItems: RequestItem[] = checkedItems.map((item) => ({
    id: item.id,
    image: item.image,
    category: item.category,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const toggleAll = () => setItems((prev) => prev.map((item) => ({ ...item, checked: !allChecked })));
  const toggleItem = (id: string) => setItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));
  const deleteAll = () => setItems([]);
  const deleteSelected = () => setItems((prev) => prev.filter((item) => !item.checked));
  const changeQuantity = (id: string, quantity: number) =>   
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity } : item)
    );

  return (
    <div className="min-h-screen bg-[#FBF8F4] min-w-[1280px]">
      <Header
        device="pc"
        isLoggedIn={true}
        role="member"
        cartCount={items.length}
      />

      <div className="max-w-[1920px] mx-auto py-10 px-[120px] overflow-x-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">장바구니</h1>
        <div className="flex gap-4">
          <CartItemList
            items={items}
            allChecked={allChecked}
            onToggleAll={toggleAll}
            onToggleItem={toggleItem}
            onDeleteAll={deleteAll}
            onDeleteSelected={deleteSelected}
            onQuantityChange={changeQuantity}
          />
          <CartSummary
            checkedCount={checkedItems.length}
            totalProductPrice={totalProductPrice}
            totalShipping={totalShipping}
            totalPrice={totalPrice}
            totalCount={totalCount}
            requestItems={requestItems}
          />
        </div>
      </div>
    </div>
  );
}