export type PartStatusDTO = "in_stock" | "low_stock" | "out_of_stock"

export interface PartResponseDTO {
  id: number
  partName: string
  partNumber: string
  quantity: number
  price: string
  imageUrl: string | null
  imageLastModifiedAt: number | null
  categoryId: number | null
  categoryName: string | null
  status: PartStatusDTO
  createdAt: string
}

export interface PartRequestDTO {
  partName: string
  partNumber: string
  quantity: number
  price: number
  image?: File | null
  imageLastModifiedAt?: number | null
  categoryId: number | null
  status: PartStatusDTO
}

export type UpdatePartRequestDTO = PartRequestDTO
