import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  SettingsResponseDTO,
  UserPreferencesDTO,
  WorkspaceSettingsDTO,
} from "@/lib/dtos/settings_dtos"

type SettingsEnvelope = {
  data: SettingsResponseDTO
}

export async function getSettings() {
  const response = await apiRequest<SettingsEnvelope>({
    endpoint: "/settings",
    methodType: methodType.GET,
  })

  return response.data
}

export async function updateUserPreferences(
  payload: Partial<UserPreferencesDTO>
) {
  const response = await apiRequest<
    SettingsEnvelope,
    Partial<UserPreferencesDTO>
  >({
    data: payload,
    endpoint: "/settings/preferences",
    methodType: methodType.PATCH,
  })

  return response.data
}

export async function updateWorkspaceSettings(
  payload: Partial<WorkspaceSettingsDTO>
) {
  const response = await apiRequest<
    SettingsEnvelope,
    Partial<WorkspaceSettingsDTO>
  >({
    data: payload,
    endpoint: "/settings/workspace",
    methodType: methodType.PATCH,
  })

  return response.data
}
