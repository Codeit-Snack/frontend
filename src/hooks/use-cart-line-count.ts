"use client"

import { useCallback, useEffect, useState } from "react"

import { buildCartAuthHeaders } from "@/lib/cart/auth-headers"
import { CART_LINE_COUNT_UPDATED_EVENT } from "@/lib/cart/events"
import { pickCartItemList } from "@/lib/cart/payload"

/**
 * 장바구니 **품목(줄) 개수** — 총 수량 합이 아님.
 */
export function useCartLineCount(): number {
  const [count, setCount] = useState(0)

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return
    const auth = buildCartAuthHeaders()
    if (!auth.Authorization) {
      setCount(0)
      return
    }
    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
        headers: auth,
      })
      if (!res.ok) {
        setCount(0)
        return
      }
      const data: unknown = await res.json()
      setCount(pickCartItemList(data).length)
    } catch {
      setCount(0)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onUpdate = () => void refresh()
    window.addEventListener(CART_LINE_COUNT_UPDATED_EVENT, onUpdate)
    window.addEventListener("focus", onUpdate)
    return () => {
      window.removeEventListener(CART_LINE_COUNT_UPDATED_EVENT, onUpdate)
      window.removeEventListener("focus", onUpdate)
    }
  }, [refresh])

  return count
}
