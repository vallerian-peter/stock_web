"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  BellIcon,
  BellRingIcon,
  CheckCheckIcon,
  Clock3Icon,
  RefreshCwIcon,
} from "lucide-react"
import { toast } from "sonner"

import { getNotificationText } from "@/app/dashboard/notifications/components/dashboard-notifications-page"
import { notificationCopy } from "@/app/dashboard/notifications/components/notification-copy"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toHumanForm } from "@/lib/formatters"
import { cn } from "@/lib/utils"

import { useNotifications } from "./notifications-provider"

export function NotificationsSheet() {
  const { locale } = useLandingLocale()
  const copy = notificationCopy[locale]
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const {
    error,
    isLoading,
    markAllAsRead,
    markAsRead,
    notifications,
    refresh,
    unreadCount,
  } = useNotifications()

  async function openNotification(id: number, redirectTo: string, read: boolean) {
    try {
      if (!read) await markAsRead(id)
      setOpen(false)
      router.push(redirectTo)
    } catch {
      toast.error(copy.actionError)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="relative z-0 bg-muted/20"
            aria-label={copy.title}
          />
        }
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <Badge className="absolute -top-1 -right-1 min-w-4 border-2 border-background px-1 text-[9px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        ) : null}
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full border-zinc-200 bg-white p-0 text-zinc-950 sm:max-w-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
      >
        <SheetHeader className="border-b border-zinc-200 px-6 py-5 pr-14 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base text-zinc-950 dark:text-white">
              {copy.title}
            </SheetTitle>
            <Badge variant="secondary">
              {copy.unreadCount.replace(
                "{count}",
                unreadCount.toLocaleString(numberLocale)
              )}
            </Badge>
          </div>
          <SheetDescription className="text-zinc-600 dark:text-zinc-400">
            {copy.description}
          </SheetDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              disabled={unreadCount === 0}
              onClick={() =>
                void markAllAsRead().catch(() => toast.error(copy.actionError))
              }
            >
              <CheckCheckIcon data-icon="inline-start" />
              {copy.markAllRead}
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={copy.retry}
              onClick={() =>
                void refresh().catch(() => toast.error(copy.actionError))
              }
            >
              <RefreshCwIcon />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <Empty className="min-h-80">
              <EmptyTitle>{copy.loading}</EmptyTitle>
            </Empty>
          ) : error ? (
            <Empty className="min-h-80">
              <EmptyTitle>{copy.loadError}</EmptyTitle>
              <EmptyDescription>{error}</EmptyDescription>
            </Empty>
          ) : notifications.length === 0 ? (
            <Empty className="min-h-80">
              <BellRingIcon className="size-8 text-zinc-400" />
              <EmptyTitle>{copy.emptyTitle}</EmptyTitle>
              <EmptyDescription>{copy.emptyDescription}</EmptyDescription>
            </Empty>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => {
                const text = getNotificationText(
                  notification,
                  copy,
                  numberLocale
                )

                return (
                  <button
                    type="button"
                    key={notification.id}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition-colors",
                      notification.readAt
                        ? "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                        : "border-zinc-400 bg-zinc-100 ring-1 ring-zinc-300/70 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                    )}
                    onClick={() =>
                      void openNotification(
                        notification.id,
                        notification.redirectTo,
                        Boolean(notification.readAt)
                      )
                    }
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                      <BellIcon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[12px] font-semibold">
                        {text.title}
                        {!notification.readAt ? (
                          <span className="size-1.5 rounded-full bg-black dark:bg-white" />
                        ) : null}
                      </span>
                      <span className="mt-1 line-clamp-2 block text-[10px] leading-4 text-zinc-600 dark:text-zinc-400">
                        {text.description}
                      </span>
                      <span className="mt-2 flex items-center gap-1 text-[9px] text-zinc-500">
                        <Clock3Icon className="size-2.5" />
                        {toHumanForm(notification.createdAt, locale)}
                      </span>
                    </span>
                    <ArrowRightIcon className="mt-2 size-3.5 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
