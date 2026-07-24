"use client"

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from "react"

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type AlertNotificationDTO,
} from "@/api/notifications_api"
import { getApiErrorMessage } from "@/lib/api/request"

type NotificationsContextValue = {
  deleteAll: () => Promise<void>
  deleteOne: (id: number) => Promise<void>
  error: string | null
  isLoading: boolean
  markAllAsRead: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  notifications: AlertNotificationDTO[]
  refresh: () => Promise<void>
  unreadCount: number
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
)

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<AlertNotificationDTO[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      setError(null)
      const response = await getNotifications()
      setNotifications(response.data)
      setUnreadCount(response.meta.unreadCount)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError))
    } finally {
      setIsLoading(false)
    }
  }

  const refreshFromEffect = useEffectEvent(refresh)

  useEffect(() => {
    const initialTimeout = window.setTimeout(() => void refreshFromEffect(), 0)
    const refreshInterval = window.setInterval(
      () => void refreshFromEffect(),
      60_000
    )
    const handleFocus = () => void refreshFromEffect()

    window.addEventListener("focus", handleFocus)

    return () => {
      window.clearTimeout(initialTimeout)
      window.clearInterval(refreshInterval)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  async function markAsRead(id: number) {
    const response = await markNotificationAsRead(id)

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? response.data : notification
      )
    )
    setUnreadCount((current) =>
      notifications.some(
        (notification) => notification.id === id && !notification.readAt
      )
        ? Math.max(0, current - 1)
        : current
    )
  }

  async function markAllAsRead() {
    await markAllNotificationsAsRead()
    const readAt = new Date().toISOString()
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        readAt: notification.readAt ?? readAt,
      }))
    )
    setUnreadCount(0)
  }

  async function deleteOne(id: number) {
    await deleteNotification(id)
    setNotifications((current) => {
      const deleted = current.find((notification) => notification.id === id)
      if (deleted && !deleted.readAt) {
        setUnreadCount((count) => Math.max(0, count - 1))
      }

      return current.filter((notification) => notification.id !== id)
    })
  }

  async function deleteAll() {
    await deleteAllNotifications()
    setNotifications([])
    setUnreadCount(0)
  }

  const value = {
    deleteAll,
    deleteOne,
    error,
    isLoading,
    markAllAsRead,
    markAsRead,
    notifications,
    refresh,
    unreadCount,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    )
  }

  return context
}
