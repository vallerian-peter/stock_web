import axios, { AxiosHeaders, type AxiosRequestConfig } from "axios"

import { apiClient } from "@/lib/api/axios"
import type { MethodType } from "@/lib/api/method-type"

export type ApiRequestOptions<TPayload = unknown> = {
  data?: TPayload
  endpoint: string
  headers?: AxiosRequestConfig["headers"]
  methodType: MethodType
  params?: AxiosRequestConfig["params"]
}

export async function apiRequest<TResponse, TPayload = unknown>({
  data,
  endpoint,
  headers,
  methodType,
  params,
}: ApiRequestOptions<TPayload>) {
  const resolvedHeaders =
    headers instanceof AxiosHeaders
      ? AxiosHeaders.from(headers)
      : new AxiosHeaders(headers as Record<string, string>)

  if (typeof FormData !== "undefined" && data instanceof FormData) {
    resolvedHeaders.delete("Content-Type")
  }

  const response = await apiClient.request<TResponse>({
    data,
    headers: resolvedHeaders,
    method: methodType,
    params,
    url: endpoint,
  })

  return response.data
}

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message

    if (typeof message === "string" && message.trim().length > 0) {
      return message
    }

    const firstFieldError = Object.values(error.response?.data?.errors ?? {}).find(
      (value): value is string[] =>
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string"
    )?.[0]

    if (typeof firstFieldError === "string" && firstFieldError.trim().length > 0) {
      return firstFieldError
    }

    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Something went wrong while calling the API."
}
