import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type { PaginatedApiResponse } from "@/lib/types"

export type ReceivableRequestDTO = {
  customerName: string
  customerPhone?: string
  referenceNumber?: string
  totalAmount: number
  amountPaid?: number
  debtDate: string
  dueDate?: string
  notes?: string
}

export type ReceivableResponseDTO = {
  id: number
  saleId: number | null
  customerName: string
  customerPhone: string | null
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

export async function getReceivables(page = 1, perPage = 15) {
  return apiRequest<PaginatedApiResponse<ReceivableResponseDTO>>({
    endpoint: "/receivables",
    methodType: methodType.GET,
    params: { page, per_page: perPage },
  })
}

export async function createReceivable(payload: ReceivableRequestDTO) {
  const response = await apiRequest<
    ReceivableResponseDTO | { data: ReceivableResponseDTO },
    ReceivableRequestDTO
  >({
    data: payload,
    endpoint: "/receivables",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function deleteReceivable(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/receivables/${id}`,
    methodType: methodType.DELETE,
  })
}
