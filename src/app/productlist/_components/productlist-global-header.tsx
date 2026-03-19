"use client"

import { Header } from "@/components/header"
import { useDevice } from "@/hooks/use-device"

export function ProductListGlobalHeader() {
  const device = useDevice()

  return <Header device={device} isLoggedIn role="member" cartCount={2} />
}

