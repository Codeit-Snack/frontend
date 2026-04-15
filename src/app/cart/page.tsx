"use client";
import { useState, useEffect } from "react";
import CartItemList from "@/components/cart/cart-item-list";
import CartSummary from "@/components/cart/cart-summary";
import type { RequestItem } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { useAuthHeader } from "@/hooks/use-auth-header";
import CartComplete from "@/components/cart/cart-complete";
import { useDevice } from "@/hooks/use-device";
import { AUTH_ACCESS_TOKEN_KEY } from "@/lib/auth/constants";

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

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildCartAuthHeaders(): Record<string, string> {
  const token =
    typeof window === "undefined"
      ? ""
      : (localStorage.getItem(AUTH_ACCESS_TOKEN_KEY) ?? "").trim();
  const h: Record<string, string> = {};
  if (!token) return h;
  h.Authorization = `Bearer ${token}`;
  const payload = decodeJwtPayload(token);
  const org =
    payload?.organizationId ??
    payload?.organization_id ??
    payload?.orgId ??
    payload?.org_id;
  if (org !== undefined && org !== null && String(org).trim()) {
    h["X-Organization-Id"] = String(org).trim();
  }
  return h;
}

function pickCartItemList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const p = payload as Record<string, unknown>;
  const data =
    p.data !== undefined && p.data !== null && typeof p.data === "object" && !Array.isArray(p.data)
      ? (p.data as Record<string, unknown>)
      : p;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.cartItems)) return data.cartItems;
  if (Array.isArray(data.lines)) return data.lines;
  return [];
}

function mapCartRow(item: unknown): CartItemData | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  const id = String(row.id ?? row.cartItemId ?? row.lineId ?? "").trim();
  if (!id) return null;
  const product =
    row.product && typeof row.product === "object"
      ? (row.product as Record<string, unknown>)
      : row;
  return {
    id,
    image: String(product.imageKey ?? product.image ?? ""),
    category: String(product.categoryId ?? product.category ?? ""),
    name: String(product.name ?? product.productName ?? ""),
    price: Number(product.price ?? product.unitPrice ?? 0),
    quantity: Math.max(1, Number(row.quantity ?? 1)),
    shipping: 3000,
    checked: true,
  };
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
        const auth = buildCartAuthHeaders();
        if (!auth.Authorization) {
          setItems([]);
          return;
        }
        const res = await fetch("/api/cart", {
          credentials: "include",
          headers: auth,
        });
        if (!res.ok) {
          setItems([]);
          return;
        }
        const data: unknown = await res.json();
        const rows = pickCartItemList(data);
        const mapped = rows.map(mapCartRow).filter((v): v is CartItemData => v !== null);
        setItems(mapped);
      } catch (e) {
        console.error("장바구니 조회 실패", e);
        setItems([]);
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
    const auth = buildCartAuthHeaders();
    try {
      await Promise.all(
        items.map((item) =>
          fetch(`/api/cart/items/${encodeURIComponent(item.id)}`, {
            method: "DELETE",
            credentials: "include",
            headers: auth,
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
    const auth = buildCartAuthHeaders();
    try {
      await Promise.all(
        selectedItems.map((item) =>
          fetch(`/api/cart/items/${encodeURIComponent(item.id)}`, {
            method: "DELETE",
            credentials: "include",
            headers: auth,
          })
        )
      );
    } catch (e) {
      console.error("선택 삭제 실패", e);
    }
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const deleteItem = async (id: string) => {
    const auth = buildCartAuthHeaders();
    try {
      await fetch(`/api/cart/items/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        headers: auth,
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
      await fetch(`/api/cart/items/${encodeURIComponent(id)}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...buildCartAuthHeaders(),
        },
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