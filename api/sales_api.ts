import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import { PaginatedApiResponse } from "@/lib/types"

export type SaleItemRequestDTO = {
  partId: number
  quantity: number
  unitPrice: number
}

export type SaleRequestDTO = {
  saleNumber?: string
  customerName?: string
  customerPhone?: string
  isDebt?: boolean
  debtDueDate?: string
  paymentStatus: string
  paymentMethod: string
  amountPaid?: number
  additionalAmount?: number
  soldAt: string
  notes?: string
  items: SaleItemRequestDTO[]
}

export type SaleItemResponseDTO = {
  id: number
  partId: number
  partName: string
  partNumber: string
  quantity: number
  unitPrice: string
  subtotal: string
}

export type SaleResponseDTO = {
  id: number
  saleNumber: string | null
  customerName: string | null
  paymentStatus: string
  paymentMethod: string | null
  totalAmount: string
  amountPaid: string
  soldBy: number
  soldByName: string | null
  soldAt: string
  notes: string | null
  createdAt: string
  outgoingStockId: number | null
  receivableId: number | null
  items: SaleItemResponseDTO[]
}

type GetSalesOptions = {
  page?: number
  perPage?: number
}

export async function getSales({
  page = 1,
  perPage = 15,
}: GetSalesOptions = {}) {
  return apiRequest<PaginatedApiResponse<SaleResponseDTO>>({
    endpoint: "/sales",
    methodType: methodType.GET,
    params: {
      page,
      per_page: perPage,
    },
  })
}

export async function createSale(payload: SaleRequestDTO) {
  const response = await apiRequest<
    SaleResponseDTO | { data: SaleResponseDTO },
    SaleRequestDTO
  >({
    data: payload,
    endpoint: "/sales",
    methodType: methodType.POST,
  })

  return "data" in response ? response.data : response
}

export async function deleteSale(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/sales/${id}`,
    methodType: methodType.DELETE,
  })
}
