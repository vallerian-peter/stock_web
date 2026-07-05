
export interface UserResponseDTO {
    id: number;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    status: "Active" | "Inactive";
    createdAt: string;
}

export interface UserRequestDTO {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: "admin" | "user";
    status: "Active" | "Inactive";
    password: string;
}

export interface UpdateUserRequestDTO extends Omit<UserRequestDTO, "password"> {
    password?: string;
}
