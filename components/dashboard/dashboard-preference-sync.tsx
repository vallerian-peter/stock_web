"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { getSettings } from "@/api/settings_api"
import { useLandingLocale } from "@/components/landing-locale-provider"

export function DashboardPreferenceSync() {
  const { setTheme } = useTheme()
  const { setLocale } = useLandingLocale()

  const syncPreferences = React.useEffectEvent(async () => {
    try {
      const { preferences } = await getSettings()

      setTheme(preferences.theme)
      setLocale(preferences.locale)
      document.documentElement.dataset.compactTables = String(
        preferences.compactTables
      )
    } catch {
      // Authentication and network failures are handled by the shared API client.
    }
  })

  React.useEffect(() => {
    void syncPreferences()
  }, [])

  return null
}
