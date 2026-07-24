import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import { PaginatedApiResponse } from "@/lib/types"

export type OutgoingStockItemRequestDTO = {
  partId: number
  quantity: number
  unitPrice?: number // Optional, for SALES
}

export type OutgoingStockRequestDTO = {
  dispatchNumber?: string
  purpose: string // 'SALE', 'DAMAGED', 'RETURN'
  dispatchedAt: string
  notes?: string
  items: OutgoingStockItemRequestDTO[]

  // Optional Sales Fields
  paymentStatus?: string
  paymentMethod?: string
  amountPaid?: number
  additionalAmount?: number
  customerName?: string
  customerPhone?: string
  isDebt?: boolean
  debtDueDate?: string
  saleNumber?: string
}

export type OutgoingStockItemResponseDTO = {
  id: number
  partId: number
  partName: string
  partNumber: string
  quantity: number
}

export type OutgoingStockResponseDTO = {
  id: number
  dispatchNumber: string | null
  recipientName: string | null
  purpose: string
  dispatchedBy: number
  dispatchedByName: string | null
  dispatchedAt: string
  notes: string | null
  createdAt: string
  items: OutgoingStockItemResponseDTO[]
  sale: {
    id: number
    saleNumber: string | null
    customerName: string | null
    paymentStatus: string
    paymentMethod: string | null
    totalAmount: string
    amountPaid: string
    receivableId: number | null
  } | null
}

type GetOutgoingStocksOptions = {
  page?: number
  perPage?: number
}

export async function getOutgoingStocks({
  page = 1,
  perPage = 15,
}: GetOutgoingStocksOptions = {}) {
  return apiRequest<PaginatedApiResponse<OutgoingStockResponseDTO>>({
    endpoint: "/outgoing-stocks",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function createOutgoingStock(payload: OutgoingStockRequestDTO) {
  const response = await apiRequest<
    OutgoingStockResponseDTO | { data: OutgoingStockResponseDTO },
    OutgoingStockRequestDTO
  >({
    data: payload,
    endpoint: "/outgoing-stocks",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function deleteOutgoingStock(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/outgoing-stocks/${id}`,
    methodType: methodType.DELETE,
  })
}
