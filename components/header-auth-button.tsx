"use client"

import Link from "next/link"
import { ChevronRightIcon, LogInIcon, UserIcon } from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { buttonVariants } from "@/components/ui/button"
import type { DashboardUser } from "@/lib/types"
import { cn } from "@/lib/utils"

type HeaderAuthButtonProps = {
  user: DashboardUser | null
}

export function HeaderAuthButton({ user }: HeaderAuthButtonProps) {
  const { locale } = useLandingLocale()
  const copy = locale === "sw"
    ? {
        dashboard: "Dashibodi",
        login: "Ingia",
      }
    : {
        dashboard: "Dashboard",
        login: "Log in",
      }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className={cn(
          buttonVariants({ size: "sm" }),
          "h-9 rounded-full bg-orange-600 px-4 text-white hover:bg-orange-500"
        )}
      >
        <LogInIcon className="size-3.5" />
        {copy.login}
      </Link>
    )
  }

  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white transition hover:bg-white/15"
    >
      <div className="flex size-8 items-center justify-center rounded-full bg-white/15">
        <UserIcon className="size-4" />
      </div>
      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-xs font-semibold leading-none">
          {user.name}
        </p>
        <p className="truncate pt-1 text-[11px] text-white/70">
          {user.email}
        </p>
      </div>
      <span className="hidden text-[11px] font-medium text-white/80 lg:inline">
        {copy.dashboard}
      </span>
      <ChevronRightIcon className="size-4 text-white/70" />
    </Link>
  )
}
