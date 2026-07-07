import { clearAccessToken, setAccessToken } from "@/lib/api/axios"
import { clearAuthSession, persistAuthSession } from "@/lib/auth/auth-session"
import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"
import type { AuthRequestDTO, AuthResponseDTO } from "@/lib/dtos/auth_dtos"

type LoginApiResponse = {
  message: string
  token: string
  token_type: string
  user: AuthResponseDTO["user"]
}

type LoginApiEnvelope = LoginApiResponse | { data: LoginApiResponse }

export async function login(payload: AuthRequestDTO): Promise<AuthResponseDTO> {
  const response = await apiRequest<LoginApiEnvelope, AuthRequestDTO>({
    data: payload,
    endpoint: "/login",
    methodType: methodType.POST,
  })

  const resolvedResponse = "data" in response ? response.data : response

  const authResponse = {
    message: resolvedResponse.message,
    token: resolvedResponse.token,
    tokenType: resolvedResponse.token_type,
    user: resolvedResponse.user,
  }

  setAccessToken(resolvedResponse.token)
  persistAuthSession(authResponse)

  return authResponse
}

export async function logout() {
  try {
    const response = await apiRequest<{ message: string }>({
      endpoint: "/logout",
      methodType: methodType.POST,
    })
    return response
  } catch (error) {
    // If the session has already expired on backend (401), we still want to log out client-side.
    console.warn("Server-side logout failed, proceeding with client-side cleanup:", error)
  } finally {
    clearAccessToken()
    clearAuthSession()
  }
}
