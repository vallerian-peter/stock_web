"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import type { UserPreferencesDTO } from "@/lib/dtos/settings_dtos"

import type { SettingsCopy } from "./settings-copy"
import { SettingsRow, SettingsToggle } from "./settings-controls"
import type { SavePreferences } from "./settings-types"

export function GeneralSettingsPanel({
  preferences,
  copy,
  saving,
  onSave,
}: {
  preferences: UserPreferencesDTO
  copy: SettingsCopy["general"]
  saving: boolean
  onSave: SavePreferences
}) {
  const themeOptions = [
    { value: "light" as const, label: copy.light, icon: SunIcon },
    { value: "dark" as const, label: copy.dark, icon: MoonIcon },
    { value: "system" as const, label: copy.system, icon: MonitorIcon },
  ]
  const selectedTheme =
    themeOptions.find(({ value }) => value === preferences.theme) ??
    themeOptions[2]
  const SelectedThemeIcon = selectedTheme.icon

  const languageOptions = [
    { value: "en" as const, label: copy.english, flag: "🇺🇸" },
    { value: "sw" as const, label: copy.swahili, flag: "🇹🇿" },
  ]
  const selectedLanguage =
    languageOptions.find(({ value }) => value === preferences.locale) ??
    languageOptions[0]

  return (
    <div>
      <SettingsRow
        label={copy.appearance}
        description={copy.appearanceDescription}
      >
        <Select
          value={preferences.theme}
          onValueChange={(value) => {
            if (value === "light" || value === "dark" || value === "system") {
              void onSave({ theme: value })
            }
          }}
        >
          <SelectTrigger
            className="h-9 w-36 rounded-xl bg-background px-3"
            disabled={saving}
            aria-label={copy.appearance}
          >
            <span className="flex min-w-0 items-center gap-2">
              <SelectedThemeIcon className="size-3.5 shrink-0" />
              <span className="truncate">{selectedTheme.label}</span>
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <SelectItem key={value} value={value}>
                <Icon />
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsRow>

      <SettingsRow label={copy.language} description={copy.languageDescription}>
        <Select
          value={preferences.locale}
          onValueChange={(value) => {
            if (value === "en" || value === "sw") {
              void onSave({ locale: value })
            }
          }}
        >
          <SelectTrigger
            className="h-9 w-36 rounded-xl bg-background px-3"
            disabled={saving}
            aria-label={copy.language}
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-sm" aria-hidden="true">
                {selectedLanguage.flag}
              </span>
              <span className="truncate">{selectedLanguage.label}</span>
            </span>
          </SelectTrigger>
          <SelectContent align="end">
            {languageOptions.map(({ value, label, flag }) => (
              <SelectItem key={value} value={value}>
                <span className="text-sm" aria-hidden="true">
                  {flag}
                </span>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsRow>

      <SettingsRow
        label={copy.compactTables}
        description={copy.compactTablesDescription}
      >
        <SettingsToggle
          label={copy.compactTables}
          checked={preferences.compactTables}
          disabled={saving}
          onCheckedChange={(checked) => void onSave({ compactTables: checked })}
        />
      </SettingsRow>
    </div>
  )
}
