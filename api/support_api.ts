import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type {
  CreateSupportRequestDTO,
  SupportRequestDTO,
} from "@/lib/dtos/support_dtos"

type SupportRequestsEnvelope = {
  data: SupportRequestDTO[]
}

type SupportRequestEnvelope = {
  data: SupportRequestDTO
  message: string
}

export async function getSupportRequests() {
  const response = await apiRequest<SupportRequestsEnvelope>({
    endpoint: "/support-requests",
    methodType: methodType.GET,
  })

  return response.data
}

export async function createSupportRequest(payload: CreateSupportRequestDTO) {
  return apiRequest<SupportRequestEnvelope, CreateSupportRequestDTO>({
    data: payload,
    endpoint: "/support-requests",
    methodType: methodType.POST,
  })
}
