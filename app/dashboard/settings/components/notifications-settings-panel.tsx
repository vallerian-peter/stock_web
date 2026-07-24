"use client"

import type { UserPreferencesDTO } from "@/lib/dtos/settings_dtos"

import type { SettingsCopy } from "./settings-copy"
import { SettingsRow, SettingsToggle } from "./settings-controls"
import type { SavePreferences } from "./settings-types"

export function NotificationsSettingsPanel({
  preferences,
  copy,
  saving,
  onSave,
}: {
  preferences: UserPreferencesDTO
  copy: SettingsCopy["notifications"]
  saving: boolean
  onSave: SavePreferences
}) {
  const options = [
    {
      key: "lowStockAlerts" as const,
      label: copy.lowStock,
      description: copy.lowStockDescription,
    },
    {
      key: "salesDigest" as const,
      label: copy.sales,
      description: copy.salesDescription,
    },
    {
      key: "debtReminders" as const,
      label: copy.debt,
      description: copy.debtDescription,
    },
  ]

  return (
    <div>
      {options.map(({ key, label, description }) => (
        <SettingsRow key={key} label={label} description={description}>
          <SettingsToggle
            label={label}
            checked={preferences[key]}
            disabled={saving}
            onCheckedChange={(checked) => void onSave({ [key]: checked })}
          />
        </SettingsRow>
      ))}
    </div>
  )
}
