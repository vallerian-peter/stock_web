"use client"

import {
  BugIcon,
  InboxIcon,
  LifeBuoyIcon,
  MessageCircleIcon,
  MessageSquareHeartIcon,
  RefreshCwIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type {
  SupportRequestDTO,
  SupportRequestType,
} from "@/lib/dtos/support_dtos"

import type { HelpCenterCopy } from "./help-center-copy"

const typeIcons = {
  help: LifeBuoyIcon,
  chat: MessageCircleIcon,
  bug: BugIcon,
  feedback: MessageSquareHeartIcon,
} satisfies Record<
  SupportRequestType,
  React.ComponentType<React.ComponentProps<"svg">>
>

export function SupportRequestHistory({
  copy,
  requests,
  loading,
  loadError,
  locale,
  onRetry,
}: {
  copy: HelpCenterCopy["history"]
  requests: SupportRequestDTO[]
  loading: boolean
  loadError: boolean
  locale: "en" | "sw"
  onRetry: () => void
}) {
  return (
    <aside className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
      <div className="border-b border-border/60 pb-4">
        <h2 className="font-heading text-sm font-semibold">{copy.title}</h2>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {copy.description}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3 pt-4" aria-label={copy.loading}>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : null}

      {!loading && loadError ? (
        <div className="py-8 text-center">
          <p className="text-[11px] text-muted-foreground">{copy.loadFailed}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-3 rounded-xl"
            onClick={onRetry}
          >
            <RefreshCwIcon />
            {copy.retry}
          </Button>
        </div>
      ) : null}

      {!loading && !loadError && requests.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <InboxIcon className="size-4" />
          </span>
          <p className="mt-3 text-[11px] font-medium">{copy.emptyTitle}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {copy.emptyDescription}
          </p>
        </div>
      ) : null}

      {!loading && !loadError && requests.length > 0 ? (
        <div className="divide-y divide-border/60">
          {requests.map((request) => {
            const Icon = typeIcons[request.type]

            return (
              <article key={request.id} className="flex gap-3 py-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[11px] font-medium">
                      {request.subject}
                    </p>
                    <Badge
                      variant="outline"
                      className="shrink-0 bg-muted/60 text-muted-foreground"
                    >
                      {copy.statuses[request.status]}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-muted-foreground">
                    <span>{copy.types[request.type]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{request.referenceNumber}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={request.createdAt}>
                      {new Intl.DateTimeFormat(
                        locale === "sw" ? "sw-TZ" : "en-US",
                        { day: "numeric", month: "short" }
                      ).format(new Date(request.createdAt))}
                    </time>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : null}
    </aside>
  )
}
