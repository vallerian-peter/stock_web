import { methodType } from "@/lib/api/method-type"
import { apiRequest } from "@/lib/api/request"

export type NotificationType =
  | "DAILY_TREND"
  | "DEBT_DUE_PAYABLE"
  | "DEBT_DUE_RECEIVABLE"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"

export type NotificationSeverity = "critical" | "info" | "warning"

export type NotificationDetails = Record<
  string,
  number | string | null | undefined
>

export type AlertNotificationDTO = {
  id: number
  type: NotificationType
  severity: NotificationSeverity
  redirectTo: string
  details: NotificationDetails
  readAt: string | null
  createdAt: string
}

type NotificationsResponse = {
  data: AlertNotificationDTO[]
  meta: {
    total: number
    unreadCount: number
  }
}

export function getNotifications() {
  return apiRequest<NotificationsResponse>({
    endpoint: "/notifications",
    methodType: methodType.GET,
  })
}

export function markNotificationAsRead(id: number) {
  return apiRequest<{ data: AlertNotificationDTO }>({
    endpoint: `/notifications/${id}/read`,
    methodType: methodType.POST,
  })
}

export function markAllNotificationsAsRead() {
  return apiRequest<{ message: string }>({
    endpoint: "/notifications/read-all",
    methodType: methodType.POST,
  })
}

export function deleteNotification(id: number) {
  return apiRequest<{ message: string }>({
    endpoint: `/notifications/${id}`,
    methodType: methodType.DELETE,
  })
}

export function deleteAllNotifications() {
  return apiRequest<{ message: string }>({
    endpoint: "/notifications",
    methodType: methodType.DELETE,
  })
}
