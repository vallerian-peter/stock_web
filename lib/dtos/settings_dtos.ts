export type UserPreferencesDTO = {
  theme: "light" | "dark" | "system"
  locale: "en" | "sw"
  compactTables: boolean
  lowStockAlerts: boolean
  salesDigest: boolean
  debtReminders: boolean
}

export type WorkspaceSettingsDTO = {
  lowStockThreshold: number
  allowNegativeStock: boolean
}

export type SettingsResponseDTO = {
  preferences: UserPreferencesDTO
  workspace: WorkspaceSettingsDTO
  canManageWorkspace: boolean
}
