import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  CategoryRequestDTO,
  CategoryResponseDTO,
  UpdateCategoryRequestDTO,
} from "@/lib/dtos/category_dtos"
import { PaginatedApiResponse } from "@/lib/types"

type GetCategoriesOptions = {
  page?: number
  perPage?: number
}

export async function getCategories({
  page = 1,
  perPage = 15,
}: GetCategoriesOptions = {}) {
  return apiRequest<PaginatedApiResponse<CategoryResponseDTO>>({
    endpoint: "/categories",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function createCategory(payload: CategoryRequestDTO) {
  const response = await apiRequest<
    CategoryResponseDTO | { data: CategoryResponseDTO },
    CategoryRequestDTO
  >({
    data: payload,
    endpoint: "/categories",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function updateCategory(
  categoryId: number,
  payload: UpdateCategoryRequestDTO
) {
  const response = await apiRequest<
    CategoryResponseDTO | { data: CategoryResponseDTO },
    UpdateCategoryRequestDTO
  >({
    data: payload,
    endpoint: `/categories/${categoryId}`,
    methodType: methodType.PATCH,
  })

  return "data" in response ? response.data : response
}

export async function deleteCategory(categoryId: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/categories/${categoryId}`,
    methodType: methodType.DELETE,
  })
}
