import type { UserResponseDTO } from "@/lib/dtos/user_dtos"

export type AccountResponseDTO = {
  user: UserResponseDTO
  canDeleteAccount: boolean
}

export type UpdateProfileDTO = {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type ChangePasswordDTO = {
  currentPassword: string
  password: string
  password_confirmation: string
}

export type DeleteAccountDTO = {
  currentPassword: string
}
