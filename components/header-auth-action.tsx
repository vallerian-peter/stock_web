"use client"

import { useSyncExternalStore } from "react"

import {
  getClientDashboardUser,
  subscribeToAuthSession,
} from "@/lib/auth/auth-session"

import { HeaderAuthButton } from "./header-auth-button"

function getServerSnapshot() {
  return null
}

export function HeaderAuthAction() {
  const user = useSyncExternalStore(
    subscribeToAuthSession,
    getClientDashboardUser,
    getServerSnapshot
  )

  return <HeaderAuthButton user={user} />
}
