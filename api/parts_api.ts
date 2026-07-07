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
  const response = await apiRequest<PaginatedApiResponse<PartResponseDTO>>({
    endpoint: "/parts",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
  console.log("[parts_api] getParts response:", response)
  return response
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
  console.log("[parts_api] createPart raw response:", response)
  const result = "data" in response ? response.data : response
  console.log("[parts_api] createPart resolved part:", result)
  return result
}

export async function updatePart(partId: number, payload: UpdatePartRequestDTO) {
  const formData = buildPartFormData(payload)
  formData.set("_method", "PATCH")

  const response = await apiRequest<
    PartResponseDTO | { data: PartResponseDTO },
    FormData
  >({
    data: formData,
    endpoint: `/parts/${partId}`,
    methodType: methodType.POST,
  })
  console.log("[parts_api] updatePart raw response:", response)
  const result = "data" in response ? response.data : response
  console.log("[parts_api] updatePart resolved part:", result)
  return result
}

export async function deletePart(partId: number) {
  const response = await apiRequest<{ message: string }>({
    endpoint: `/parts/${partId}`,
    methodType: methodType.DELETE,
  })
  console.log("[parts_api] deletePart response:", response)
  return response
}
