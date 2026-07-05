import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  PartRequestDTO,
  PartResponseDTO,
  UpdatePartRequestDTO,
} from "@/lib/dtos/part_dtos"
import { PaginatedApiResponse } from "@/lib/types"

type GetPartsOptions = {
  page?: number
  perPage?: number
}

function buildPartFormData(payload: PartRequestDTO) {
  const formData = new FormData()

  formData.set("partName", payload.partName)
  formData.set("partNumber", payload.partNumber)
  formData.set("quantity", String(payload.quantity))
  formData.set("price", String(payload.price))
  formData.set("status", payload.status)

  if (payload.categoryId !== null) {
    formData.set("categoryId", String(payload.categoryId))
  }

  if (payload.image) {
    formData.set("image", payload.image)
  }

  if (typeof payload.imageLastModifiedAt === "number") {
    formData.set("imageLastModifiedAt", String(payload.imageLastModifiedAt))
  }

  return formData
}

export async function getParts({
  page = 1,
  perPage = 15,
}: GetPartsOptions = {}) {
  return apiRequest<PaginatedApiResponse<PartResponseDTO>>({
    endpoint: "/parts",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function createPart(payload: PartRequestDTO) {
  const response = await apiRequest<
    PartResponseDTO | { data: PartResponseDTO },
    FormData
  >({
    data: buildPartFormData(payload),
    endpoint: "/parts",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function updatePart(partId: number, payload: UpdatePartRequestDTO) {
  const response = await apiRequest<
    PartResponseDTO | { data: PartResponseDTO },
    FormData
  >({
    data: buildPartFormData(payload),
    endpoint: `/parts/${partId}`,
    methodType: methodType.PATCH,
  })

  return "data" in response ? response.data : response
}

export async function deletePart(partId: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/parts/${partId}`,
    methodType: methodType.DELETE,
  })
}
