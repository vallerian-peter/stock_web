"use client"

import * as React from "react"

import { getAccount } from "@/api/account_api"
import type { AccountResponseDTO } from "@/lib/dtos/account_dtos"

export function useAccountProfile(loadErrorMessage: string) {
  const [account, setAccount] = React.useState<AccountResponseDTO | null>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const loadAccount = React.useEffectEvent(async () => {
    try {
      setLoadError(null)
      setAccount(await getAccount())
    } catch {
      setLoadError(loadErrorMessage)
    }
  })

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAccount()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return {
    account,
    loadError,
    reload: loadAccount,
    setAccount,
  }
}
