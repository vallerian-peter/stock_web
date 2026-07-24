"use client"

import * as React from "react"

import { createSupportRequest, getSupportRequests } from "@/api/support_api"
import type {
  CreateSupportRequestDTO,
  SupportRequestDTO,
} from "@/lib/dtos/support_dtos"

export function useSupportRequests() {
  const [requests, setRequests] = React.useState<SupportRequestDTO[]>([])
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState(false)

  const loadRequests = React.useEffectEvent(async () => {
    setLoading(true)

    try {
      setRequests(await getSupportRequests())
      setLoadError(false)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  })

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadRequests(), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  async function submit(payload: CreateSupportRequestDTO) {
    const response = await createSupportRequest(payload)
    setRequests((current) => [response.data, ...current].slice(0, 8))
    return response
  }

  return {
    loadError,
    loading,
    reload: loadRequests,
    requests,
    submit,
  }
}
