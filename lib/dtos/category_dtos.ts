export interface CategoryResponseDTO {
    id: number;
    name: string;
    createdAt: string;
}

export interface CategoryRequestDTO {
    name: string;
}

export type UpdateCategoryRequestDTO = CategoryRequestDTO
