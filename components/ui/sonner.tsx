"use client"

import type { CSSProperties } from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme, theme = "system" } = useTheme()
  const activeTheme = resolvedTheme ?? theme

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      offset={{ top: 20, right: 20 }}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-emerald-500" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-500" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-500" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": activeTheme === "dark" ? "#000000" : "#e5e7eb",
          "--normal-text": activeTheme === "dark" ? "#f5f5f5" : "#111827",
          "--normal-border": activeTheme === "dark" ? "#27272a" : "#d1d5db",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast border shadow-lg backdrop-blur",
          title: "text-sm font-medium",
          description: "text-xs text-muted-foreground",
          closeButton:
            "border-border/60 bg-transparent text-foreground hover:bg-background/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
