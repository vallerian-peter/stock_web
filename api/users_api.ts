import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  UpdateUserRequestDTO,
  UserRequestDTO,
  UserResponseDTO,
} from "@/lib/dtos/user_dtos"
import { PaginatedApiResponse } from "@/lib/types"

type GetUsersOptions = {
  page?: number
  perPage?: number
}

export async function getUsers({
  page = 1,
  perPage = 15,
}: GetUsersOptions = {}) {
  return apiRequest<PaginatedApiResponse<UserResponseDTO>>({
    endpoint: "/users",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function registerUser(payload: UserRequestDTO) {
  const response = await apiRequest<
    UserResponseDTO | { data: UserResponseDTO },
    UserRequestDTO
  >({
    data: payload,
    endpoint: "/users",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function updateUser(
  userId: number,
  payload: UpdateUserRequestDTO
) {
  const response = await apiRequest<
    UserResponseDTO | { data: UserResponseDTO },
    UpdateUserRequestDTO
  >({
    data: payload,
    endpoint: `/users/${userId}`,
    methodType: methodType.PATCH,
  })

  return "data" in response ? response.data : response
}

export async function deleteUser(userId: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/users/${userId}`,
    methodType: methodType.DELETE,
  })
}
