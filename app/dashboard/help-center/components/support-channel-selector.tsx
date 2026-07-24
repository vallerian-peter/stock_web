"use client"

import {
  BugIcon,
  LifeBuoyIcon,
  MessageCircleIcon,
  MessageSquareHeartIcon,
} from "lucide-react"

import type { SupportRequestType } from "@/lib/dtos/support_dtos"
import { cn } from "@/lib/utils"

import type { HelpCenterCopy } from "./help-center-copy"

const channels = [
  { type: "help", icon: LifeBuoyIcon },
  { type: "chat", icon: MessageCircleIcon },
  { type: "bug", icon: BugIcon },
  { type: "feedback", icon: MessageSquareHeartIcon },
] satisfies Array<{
  type: SupportRequestType
  icon: React.ComponentType<React.ComponentProps<"svg">>
}>

export function SupportChannelSelector({
  activeType,
  copy,
  onSelect,
}: {
  activeType: SupportRequestType
  copy: HelpCenterCopy["channels"]
  onSelect: (type: SupportRequestType) => void
}) {
  return (
    <section aria-labelledby="support-channel-title">
      <h2 id="support-channel-title" className="sr-only">
        {copy.label}
      </h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4" role="tablist">
        {channels.map(({ type, icon: Icon }) => {
          const active = activeType === type

          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(type)}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border p-3 text-left transition-all focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:outline-none",
                active
                  ? "border-orange-500/50 bg-orange-500/5 shadow-sm"
                  : "border-border/70 bg-muted/25 hover:border-border hover:bg-muted/50"
              )}
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-orange-500 text-white"
                    : "bg-muted text-muted-foreground group-hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 pt-0.5">
                <span className="block text-[12px] font-semibold">
                  {copy[type].title}
                </span>
                <span className="mt-1 block text-[10px] leading-4 text-muted-foreground">
                  {copy[type].description}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
