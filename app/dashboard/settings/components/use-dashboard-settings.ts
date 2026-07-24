"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import {
  getSettings,
  updateUserPreferences,
  updateWorkspaceSettings,
} from "@/api/settings_api"
import { useLandingLocale } from "@/components/landing-locale-provider"
import type {
  SettingsResponseDTO,
  UserPreferencesDTO,
  WorkspaceSettingsDTO,
} from "@/lib/dtos/settings_dtos"

import { settingsCopy } from "./settings-copy"

export function useDashboardSettings() {
  const [settings, setSettings] = React.useState<SettingsResponseDTO | null>(
    null
  )
  const [saving, setSaving] = React.useState(false)
  const { locale, setLocale } = useLandingLocale()
  const { setTheme } = useTheme()
  const copy = settingsCopy[locale]

  const loadSettings = React.useEffectEvent(async () => {
    try {
      const response = await getSettings()
      setSettings(response)
      setTheme(response.preferences.theme)
      setLocale(response.preferences.locale)
    } catch {
      toast.error(copy.saveFailed)
    }
  })

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadSettings()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  const compactTables = settings?.preferences.compactTables

  React.useEffect(() => {
    if (typeof compactTables === "boolean") {
      document.documentElement.dataset.compactTables = String(compactTables)
    }
  }, [compactTables])

  async function savePreferences(patch: Partial<UserPreferencesDTO>) {
    if (!settings) return

    const previous = settings
    setSettings({
      ...settings,
      preferences: { ...settings.preferences, ...patch },
    })

    if (patch.theme) setTheme(patch.theme)
    if (patch.locale) setLocale(patch.locale)

    try {
      setSaving(true)
      setSettings(await updateUserPreferences(patch))
    } catch {
      setSettings(previous)
      setTheme(previous.preferences.theme)
      setLocale(previous.preferences.locale)
      toast.error(copy.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  async function saveWorkspace(patch: Partial<WorkspaceSettingsDTO>) {
    if (!settings) return

    const previous = settings
    setSettings({
      ...settings,
      workspace: { ...settings.workspace, ...patch },
    })

    try {
      setSaving(true)
      setSettings(await updateWorkspaceSettings(patch))
    } catch {
      setSettings(previous)
      toast.error(copy.saveFailed)
    } finally {
      setSaving(false)
    }
  }

  return {
    copy,
    savePreferences,
    saveWorkspace,
    saving,
    settings,
  }
}
