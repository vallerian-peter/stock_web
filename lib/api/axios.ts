import axios, { AxiosHeaders } from "axios"

import { getStoredAppLocale } from "@/lib/locale"

const ACCESS_TOKEN_KEY = "stock_web_access_token"

function resolveApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1"
}

export const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

export function getAccessToken() {
  if (typeof window === "undefined") {
    return null
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  const locale = getStoredAppLocale()
  const headers = AxiosHeaders.from(config.headers)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  headers.set("Accept-Language", locale)
  headers.set("X-Locale", locale)

  // When sending FormData the browser must set Content-Type itself
  // (it needs to include the multipart boundary). Remove any JSON
  // default so it is never re-added after apiRequest deletes it.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    headers.delete("Content-Type")
  }

  config.headers = headers

  return config
})
