"use client"

import type { WorkspaceSettingsDTO } from "@/lib/dtos/settings_dtos"

import type { SettingsCopy } from "./settings-copy"
import {
  SettingsRow,
  SettingsSelect,
  SettingsToggle,
} from "./settings-controls"
import type { SaveWorkspaceSettings } from "./settings-types"

export function InventorySettingsPanel({
  settings,
  copy,
  saving,
  onSave,
}: {
  settings: WorkspaceSettingsDTO
  copy: SettingsCopy["inventory"]
  saving: boolean
  onSave: SaveWorkspaceSettings
}) {
  return (
    <div>
      <SettingsRow
        label={copy.threshold}
        description={copy.thresholdDescription}
      >
        <SettingsSelect
          value={settings.lowStockThreshold}
          label={copy.threshold}
          disabled={saving}
          onChange={(value) =>
            void onSave({ lowStockThreshold: Number(value) })
          }
        >
          {[5, 10, 15, 20, 25].map((value) => (
            <option key={value} value={value}>
              {value} {copy.items}
            </option>
          ))}
        </SettingsSelect>
      </SettingsRow>

      <SettingsRow
        label={copy.negative}
        description={copy.negativeDescription}
        badge={copy.caution}
      >
        <SettingsToggle
          label={copy.negative}
          checked={settings.allowNegativeStock}
          disabled={saving}
          onCheckedChange={(checked) =>
            void onSave({ allowNegativeStock: checked })
          }
        />
      </SettingsRow>
    </div>
  )
}
