import type {
  UserPreferencesDTO,
  WorkspaceSettingsDTO,
} from "@/lib/dtos/settings_dtos"

export const accountSettingsSections = [
  "profile",
  "general",
  "notifications",
] as const

export const workspaceSettingsSections = ["inventory"] as const

export type AccountSettingsSection = (typeof accountSettingsSections)[number]
export type WorkspaceSettingsSection =
  (typeof workspaceSettingsSections)[number]
export type SettingsSection = AccountSettingsSection | WorkspaceSettingsSection

export type SavePreferences = (
  patch: Partial<UserPreferencesDTO>
) => Promise<void>

export type SaveWorkspaceSettings = (
  patch: Partial<WorkspaceSettingsDTO>
) => Promise<void>
