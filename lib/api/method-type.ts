export const methodType = {
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT",
} as const

export type MethodType = (typeof methodType)[keyof typeof methodType]
