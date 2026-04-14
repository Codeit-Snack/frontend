"use client";
import { useState, useEffect } from "react";
import CartItemList from "@/components/cart/cart-item-list";
import CartSummary from "@/components/cart/cart-summary";
import type { RequestItem } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { useAuthHeader } from "@/hooks/use-auth-header";
import CartComplete from "@/components/cart/cart-complete";
import { useDevice } from "@/hooks/use-device";

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

export default function CartPage() {
  const { isLoggedIn, role } = useAuthHeader();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const device = useDevice();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const mapped: CartItemData[] = (data.items ?? []).map((item: any) => ({
          id: String(item.id),
          image: item.product?.imageKey ?? "",
          category: String(item.product?.categoryId ?? ""),
          name: item.product?.name ?? "",
          price: Number(item.product?.price ?? 0),
          quantity: item.quantity,
          shipping: 3000,
          checked: true,
        }));
        setItems(mapped);
      } catch (e) {
        console.error("장바구니 조회 실패", e);
      }
    };
    fetchCart();
  }, []);

  const allChecked = items.every((item) => item.checked);
  const checkedItems = items.filter((item) => item.checked);
  const totalProductPrice = checkedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalShipping = checkedItems.reduce((sum, item) => sum + item.shipping, 0);
  const totalPrice = totalProductPrice + totalShipping;
  const totalCount = checkedItems.reduce((sum, item) => sum + item.quantity, 0);
  const deleteItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
  const [showComplete, setShowComplete] = useState(false);
  const [completeMessage, setCompleteMessage] = useState("");
  const device = useDevice();

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

  const deleteAll = async () => {
    try {
      await Promise.all(
        items.map((item) =>
          fetch(`/api/cart/items/${item.id}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );
    } catch (e) {
      console.error("전체 삭제 실패", e);
    }
    setItems([]);
  };

  const deleteSelected = async () => {
    const selectedItems = items.filter((item) => item.checked);
    try {
      await Promise.all(
        selectedItems.map((item) =>
          fetch(`/api/cart/items/${item.id}`, {
            method: "DELETE",
            credentials: "include",
          })
        )
      );
    } catch (e) {
      console.error("선택 삭제 실패", e);
    }
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const deleteItem = async (id: string) => {
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch (e) {
      console.error("삭제 실패", e);
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const changeQuantity = async (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity } : item)
    );
    try {
      await fetch(`/api/cart/items/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
    } catch (e) {
      console.error("수량 변경 실패", e);
    }
  };

  if (showComplete) {
    return (
      <CartComplete
        items={requestItems}
        totalCount={totalCount}
        totalPrice={totalPrice}
        message={completeMessage}
        onBack={() => {
          setItems((prev) => prev.filter((item) => !item.checked));
          setShowComplete(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4]">
      <Header
        device={device}
        isLoggedIn={isLoggedIn}
        role={role}
        cartCount={items.length}
      />
      <div className="max-w-[1920px] mx-auto py-10 px-6 lg:px-[120px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">장바구니</h1>
        <div className="flex flex-col lg:flex-row gap-4">
          <CartItemList
            items={items}
            allChecked={allChecked}
            onToggleAll={toggleAll}
            onToggleItem={toggleItem}
            onDeleteAll={deleteAll}
            onDeleteSelected={deleteSelected}
            onQuantityChange={changeQuantity}
            onDeleteItem={deleteItem}
            onComplete={(message) => {
              setCompleteMessage(message);
              setShowComplete(true);
            }}
          />
          <CartSummary
            checkedCount={checkedItems.length}
            totalProductPrice={totalProductPrice}
            totalShipping={totalShipping}
            totalPrice={totalPrice}
            totalCount={totalCount}
            requestItems={requestItems}
            onComplete={(message) => {
              setCompleteMessage(message);
              setShowComplete(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}