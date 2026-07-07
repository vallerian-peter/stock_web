import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import { PaginatedApiResponse } from "@/lib/types"

export type IncomingStockItemRequestDTO = {
  partId: number
  quantity: number
  unitCost: number
}

export type IncomingStockRequestDTO = {
  invoiceNumber?: string
  supplierName?: string
  receivedAt: string
  notes?: string
  items: IncomingStockItemRequestDTO[]
}

export type IncomingStockItemResponseDTO = {
  id: number
  partId: number
  partName: string
  partNumber: string
  quantity: number
  unitCost: string
  subtotal: string
}

export type IncomingStockResponseDTO = {
  id: number
  invoiceNumber: string | null
  supplierName: string | null
  receivedBy: number
  receivedByName: string | null
  receivedAt: string
  totalAmount: string
  notes: string | null
  createdAt: string
  items: IncomingStockItemResponseDTO[]
}

type GetIncomingStocksOptions = {
  page?: number
  perPage?: number
}

export async function getIncomingStocks({
  page = 1,
  perPage = 15,
}: GetIncomingStocksOptions = {}) {
  return apiRequest<PaginatedApiResponse<IncomingStockResponseDTO>>({
    endpoint: "/incoming-stocks",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function createIncomingStock(payload: IncomingStockRequestDTO) {
  const response = await apiRequest<
    IncomingStockResponseDTO | { data: IncomingStockResponseDTO },
    IncomingStockRequestDTO
  >({
    data: payload,
    endpoint: "/incoming-stocks",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function deleteIncomingStock(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/incoming-stocks/${id}`,
    methodType: methodType.DELETE,
  })
}
