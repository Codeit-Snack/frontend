"use client"

import { Header } from "@/components/header"
import { useAuthHeader } from "@/hooks/use-auth-header"
import { useDevice } from "@/hooks/use-device"

export function ProductListGlobalHeader() {
  const device = useDevice()
  const { isLoggedIn, role } = useAuthHeader()

  return <Header device={device} isLoggedIn={isLoggedIn} role={role} cartCount={2} />
}

