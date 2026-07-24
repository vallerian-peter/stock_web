import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  AccountResponseDTO,
  ChangePasswordDTO,
  DeleteAccountDTO,
  UpdateProfileDTO,
} from "@/lib/dtos/account_dtos"

type AccountEnvelope = {
  data: AccountResponseDTO
  message?: string
}

export async function getAccount() {
  const response = await apiRequest<AccountEnvelope>({
    endpoint: "/account",
    methodType: methodType.GET,
  })

  return response.data
}

export async function updateOwnProfile(payload: UpdateProfileDTO) {
  const response = await apiRequest<AccountEnvelope, UpdateProfileDTO>({
    data: payload,
    endpoint: "/account/profile",
    methodType: methodType.PATCH,
  })

  return response
}

export async function changeOwnPassword(payload: ChangePasswordDTO) {
  return apiRequest<{ message: string }, ChangePasswordDTO>({
    data: payload,
    endpoint: "/account/password",
    methodType: methodType.PUT,
  })
}

export async function deleteOwnAccount(payload: DeleteAccountDTO) {
  return apiRequest<{ message: string }, DeleteAccountDTO>({
    data: payload,
    endpoint: "/account",
    methodType: methodType.DELETE,
  })
}
