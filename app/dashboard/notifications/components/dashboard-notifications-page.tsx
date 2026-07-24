"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRightIcon,
  BadgeDollarSignIcon,
  BellRingIcon,
  CheckCheckIcon,
  CircleAlertIcon,
  Clock3Icon,
  EyeIcon,
  HandCoinsIcon,
  PackageMinusIcon,
  RefreshCwIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import type { AlertNotificationDTO } from "@/api/notifications_api"
import { useConfirmAlertDialog } from "@/components/confirm-alert-dialog-provider"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { useNotifications } from "@/components/notifications/notifications-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toHumanForm } from "@/lib/formatters"
import { cn } from "@/lib/utils"

import { notificationCopy, type NotificationCopy } from "./notification-copy"

type NotificationFilter = "all" | "unread"

const notificationIcons = {
  DAILY_TREND: BadgeDollarSignIcon,
  DEBT_DUE_PAYABLE: HandCoinsIcon,
  DEBT_DUE_RECEIVABLE: HandCoinsIcon,
  LOW_STOCK: PackageMinusIcon,
  OUT_OF_STOCK: CircleAlertIcon,
} as const

const severityClasses = {
  critical:
    "border-zinc-300 bg-zinc-950 text-white dark:border-zinc-700 dark:bg-white dark:text-zinc-950",
  info: "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  warning:
    "border-zinc-300 bg-zinc-200 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white",
} as const

function interpolate(
  template: string,
  values: Record<string, number | string>
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  )
}

function formatDate(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ].join("/")
}

export function getNotificationText(
  notification: AlertNotificationDTO,
  copy: NotificationCopy,
  numberLocale: string
) {
  const typeCopy = copy.types[notification.type]
  const details = notification.details

  if (
    notification.type === "DEBT_DUE_PAYABLE" ||
    notification.type === "DEBT_DUE_RECEIVABLE"
  ) {
    return {
      title: typeCopy.title,
      description: interpolate(typeCopy.description, {
        party: String(details.partyName ?? ""),
        balance: Number(details.balanceAmount ?? 0).toLocaleString(
          numberLocale
        ),
        days: Number(details.daysRemaining ?? 0).toLocaleString(numberLocale),
      }),
    }
  }

  if (
    notification.type === "LOW_STOCK" ||
    notification.type === "OUT_OF_STOCK"
  ) {
    return {
      title: typeCopy.title,
      description: interpolate(typeCopy.description, {
        part: String(details.partName ?? ""),
        quantity: Number(details.quantity ?? 0).toLocaleString(numberLocale),
      }),
    }
  }

  return {
    title: typeCopy.title,
    description: interpolate(typeCopy.description, {
      sales: Number(details.salesCount ?? 0).toLocaleString(numberLocale),
      revenue: Number(details.salesRevenue ?? 0).toLocaleString(numberLocale),
      incoming: Number(details.incomingQuantity ?? 0).toLocaleString(
        numberLocale
      ),
      outgoing: Number(details.outgoingQuantity ?? 0).toLocaleString(
        numberLocale
      ),
    }),
  }
}

function getDetailRows(
  notification: AlertNotificationDTO,
  copy: NotificationCopy,
  numberLocale: string
) {
  const details = notification.details

  if (
    notification.type === "DEBT_DUE_PAYABLE" ||
    notification.type === "DEBT_DUE_RECEIVABLE"
  ) {
    return [
      [copy.details.party, details.partyName],
      [copy.details.reference, details.referenceNumber],
      [
        copy.details.balance,
        `TZS ${Number(details.balanceAmount ?? 0).toLocaleString(numberLocale)}`,
      ],
      [
        copy.details.totalDebt,
        `TZS ${Number(details.totalAmount ?? 0).toLocaleString(numberLocale)}`,
      ],
      [copy.details.dueDate, formatDate(String(details.dueDate ?? ""))],
    ]
  }

  if (
    notification.type === "LOW_STOCK" ||
    notification.type === "OUT_OF_STOCK"
  ) {
    return [
      [copy.details.partName, details.partName],
      [copy.details.partNumber, details.partNumber],
      [
        copy.details.quantity,
        Number(details.quantity ?? 0).toLocaleString(numberLocale),
      ],
    ]
  }

  return [
    [copy.details.reportDate, formatDate(String(details.reportDate ?? ""))],
    [
      copy.details.salesCount,
      Number(details.salesCount ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.salesRevenue,
      `TZS ${Number(details.salesRevenue ?? 0).toLocaleString(numberLocale)}`,
    ],
    [
      copy.details.salesPaid,
      `TZS ${Number(details.salesPaid ?? 0).toLocaleString(numberLocale)}`,
    ],
    [
      copy.details.soldQuantity,
      Number(details.soldQuantity ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.incomingRecords,
      Number(details.incomingRecords ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.incomingQuantity,
      Number(details.incomingQuantity ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.incomingCost,
      `TZS ${Number(details.incomingCost ?? 0).toLocaleString(numberLocale)}`,
    ],
    [
      copy.details.outgoingRecords,
      Number(details.outgoingRecords ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.outgoingQuantity,
      Number(details.outgoingQuantity ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.saleDispatchQuantity,
      Number(details.saleDispatchQuantity ?? 0).toLocaleString(numberLocale),
    ],
    [
      copy.details.otherDispatchQuantity,
      Number(details.otherDispatchQuantity ?? 0).toLocaleString(numberLocale),
    ],
  ]
}

export function DashboardNotificationsPage() {
  const { locale } = useLandingLocale()
  const copy = notificationCopy[locale]
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"
  const router = useRouter()
  const confirm = useConfirmAlertDialog()
  const {
    deleteAll,
    deleteOne,
    error,
    isLoading,
    markAllAsRead,
    markAsRead,
    notifications,
    refresh,
    unreadCount,
  } = useNotifications()
  const [filter, setFilter] = useState<NotificationFilter>("all")
  const [preview, setPreview] = useState<AlertNotificationDTO | null>(null)

  const visibleNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.readAt)
      : notifications

  async function handlePreview(notification: AlertNotificationDTO) {
    try {
      if (!notification.readAt) {
        await markAsRead(notification.id)
      }
      setPreview({
        ...notification,
        readAt: notification.readAt ?? new Date().toISOString(),
      })
    } catch {
      toast.error(copy.actionError)
    }
  }

  async function handleRedirect(notification: AlertNotificationDTO) {
    try {
      if (!notification.readAt) {
        await markAsRead(notification.id)
      }
      router.push(notification.redirectTo)
    } catch {
      toast.error(copy.actionError)
    }
  }

  async function handleDelete(notification: AlertNotificationDTO) {
    const confirmed = await confirm({
      title: copy.deleteTitle,
      description: copy.deleteDescription,
      confirmLabel: copy.confirmDelete,
      cancelLabel: copy.cancel,
      variant: "destructive",
    })
    if (!confirmed) return

    try {
      await deleteOne(notification.id)
      if (preview?.id === notification.id) setPreview(null)
      toast.success(copy.deleted)
    } catch {
      toast.error(copy.actionError)
    }
  }

  async function handleDeleteAll() {
    const confirmed = await confirm({
      title: copy.deleteAllTitle,
      description: copy.deleteAllDescription,
      confirmLabel: copy.confirmDelete,
      cancelLabel: copy.cancel,
      variant: "destructive",
    })
    if (!confirmed) return

    try {
      await deleteAll()
      setPreview(null)
      toast.success(copy.deletedAll)
    } catch {
      toast.error(copy.actionError)
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAsRead()
      toast.success(copy.markedAllRead)
    } catch {
      toast.error(copy.actionError)
    }
  }

  const previewText = preview
    ? getNotificationText(preview, copy, numberLocale)
    : null

  return (
    <>
      <DashboardPage
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={unreadCount === 0}
              onClick={() => void handleMarkAllAsRead()}
            >
              <CheckCheckIcon data-icon="inline-start" />
              {copy.markAllRead}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              disabled={notifications.length === 0}
              onClick={() => void handleDeleteAll()}
            >
              <Trash2Icon data-icon="inline-start" />
              {copy.deleteAll}
            </Button>
          </>
        }
      >
        <Card className="min-h-[70vh] gap-0 rounded-2xl border-border/60 bg-card/90 py-0 shadow-sm">
          <CardHeader className="flex flex-col gap-3 border-b border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{copy.title}</CardTitle>
                <Badge variant="secondary">
                  {interpolate(copy.unreadCount, {
                    count: unreadCount.toLocaleString(numberLocale),
                  })}
                </Badge>
              </div>
              <CardDescription className="mt-1">
                {copy.description}
              </CardDescription>
            </div>
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as NotificationFilter)}
            >
              <TabsList>
                <TabsTrigger value="all">{copy.all}</TabsTrigger>
                <TabsTrigger value="unread">{copy.unread}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            {isLoading ? (
              <Empty className="min-h-96">
                <EmptyTitle>{copy.loading}</EmptyTitle>
              </Empty>
            ) : error ? (
              <Empty className="min-h-96">
                <EmptyTitle>{copy.loadError}</EmptyTitle>
                <EmptyDescription>{error}</EmptyDescription>
                <Button
                  variant="outline"
                  className="mt-2 rounded-xl"
                  onClick={() => void refresh()}
                >
                  <RefreshCwIcon data-icon="inline-start" />
                  {copy.retry}
                </Button>
              </Empty>
            ) : visibleNotifications.length === 0 ? (
              <Empty className="min-h-96">
                <BellRingIcon className="size-8 text-muted-foreground" />
                <EmptyTitle>
                  {filter === "unread" ? copy.noUnreadTitle : copy.emptyTitle}
                </EmptyTitle>
                <EmptyDescription>
                  {filter === "unread"
                    ? copy.noUnreadDescription
                    : copy.emptyDescription}
                </EmptyDescription>
              </Empty>
            ) : (
              <div className="space-y-3">
                {visibleNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type]
                  const text = getNotificationText(
                    notification,
                    copy,
                    numberLocale
                  )

                  return (
                    <article
                      key={notification.id}
                      className={cn(
                        "flex flex-col gap-4 rounded-2xl border p-4 shadow-sm transition-colors sm:flex-row sm:items-center",
                        notification.readAt
                          ? "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900/80"
                          : "border-zinc-400 bg-zinc-100 ring-1 ring-zinc-300/70 hover:bg-zinc-200/70 dark:border-zinc-600 dark:bg-zinc-900 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                          severityClasses[notification.severity]
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-[13px] font-semibold">
                            {text.title}
                          </h2>
                          {!notification.readAt ? (
                            <span className="size-1.5 rounded-full bg-black dark:bg-white" />
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                          {text.description}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock3Icon className="size-3" />
                          {toHumanForm(notification.createdAt, locale)}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {!notification.readAt ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              void markAsRead(notification.id).catch(() =>
                                toast.error(copy.actionError)
                              )
                            }
                          >
                            <CheckCheckIcon data-icon="inline-start" />
                            {copy.markRead}
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void handlePreview(notification)}
                        >
                          <EyeIcon data-icon="inline-start" />
                          {copy.preview}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                          onClick={() => void handleRedirect(notification)}
                        >
                          {notification.type === "DAILY_TREND"
                            ? copy.viewReport
                            : copy.viewRecord}
                          <ArrowRightIcon data-icon="inline-end" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={copy.delete}
                          onClick={() => void handleDelete(notification)}
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardPage>

      <Sheet
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
      >
        <SheetContent
          side="right"
          className="w-full border-zinc-200 bg-white p-0 text-zinc-950 sm:max-w-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          {preview && previewText ? (
            <>
              <SheetHeader className="border-b border-zinc-200 px-6 py-6 pr-14 dark:border-zinc-800">
                <SheetTitle className="text-base text-zinc-950 dark:text-white">
                  {previewText.title}
                </SheetTitle>
                <SheetDescription className="max-w-lg text-zinc-600 dark:text-zinc-400">
                  {previewText.description}
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {getDetailRows(preview, copy, numberLocale).map(
                    ([label, value]) => (
                      <div
                        key={String(label)}
                        className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          {label}
                        </p>
                        <p className="mt-1 text-[12px] font-semibold text-zinc-950 dark:text-white">
                          {String(value ?? "-")}
                        </p>
                      </div>
                    )
                  )}
                </div>
                {preview.type === "DAILY_TREND" ? (
                  <p className="mt-4 rounded-xl border border-zinc-300 bg-zinc-100 p-3 text-[11px] leading-5 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    {copy.dailyCountingNote}
                  </p>
                ) : null}
              </div>
              <SheetFooter className="border-t border-zinc-200 bg-white px-6 py-4 sm:flex-row sm:justify-end dark:border-zinc-800 dark:bg-zinc-950">
                <Button variant="outline" onClick={() => setPreview(null)}>
                  {copy.close}
                </Button>
                <Button
                  className="bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  onClick={() => void handleRedirect(preview)}
                >
                  {preview.type === "DAILY_TREND"
                    ? copy.viewReport
                    : copy.viewRecord}
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}
