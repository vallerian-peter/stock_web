import { UserResponseDTO } from "./user_dtos";

export interface AuthRequestDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    message: string;
    token: string;
    tokenType: string;
    user: UserResponseDTO;
}
