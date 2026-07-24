import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type { PaginatedApiResponse } from "@/lib/types"

export type PayableRequestDTO = {
  creditorName: string
  creditorPhone?: string
  referenceNumber?: string
  totalAmount: number
  amountPaid?: number
  debtDate: string
  dueDate?: string
  notes?: string
}

export type PayableResponseDTO = {
  id: number
  incomingStockId: number | null
  creditorName: string
  creditorPhone: string | null
  referenceNumber: string | null
  totalAmount: string
  amountPaid: string
  balanceAmount: string
  status: "PENDING" | "PARTIAL" | "PAID"
  debtDate: string | null
  dueDate: string | null
  notes: string | null
  createdBy: number | null
  createdByName: string | null
  createdAt: string
}

export async function getPayables(page = 1, perPage = 15) {
  return apiRequest<PaginatedApiResponse<PayableResponseDTO>>({
    endpoint: "/payables",
    methodType: methodType.GET,
    params: { page, per_page: perPage },
  })
}

export async function createPayable(payload: PayableRequestDTO) {
  const response = await apiRequest<
    PayableResponseDTO | { data: PayableResponseDTO },
    PayableRequestDTO
  >({
    data: payload,
    endpoint: "/payables",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function deletePayable(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/payables/${id}`,
    methodType: methodType.DELETE,
  })
}
