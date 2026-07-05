"use client"

import { useState, useContext, useRef, useMemo, useCallback, createContext } from 'react';
import {
  AlertTriangleIcon,
  CircleHelpIcon,
  InfoIcon,
  Trash2Icon,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConfirmVariant = "default" | "destructive" | "warning" | "info"

export type ConfirmAlertDialogOptions = {
  title: React.ReactNode
  description: React.ReactNode
  confirmLabel: string
  cancelLabel: string
  variant?: ConfirmVariant
}

type PendingConfirmation = ConfirmAlertDialogOptions & {
  resolve: (confirmed: boolean) => void
}

type ConfirmAlertDialogContextValue = {
  confirm: (options: ConfirmAlertDialogOptions) => Promise<boolean>
}

const ConfirmAlertDialogContext =
  createContext<ConfirmAlertDialogContextValue | null>(null)

const variantStyles: Record<ConfirmVariant, string> = {
  default: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
}

function ConfirmationIcon({ variant }: { variant: ConfirmVariant }) {
  if (variant === "destructive") return <Trash2Icon />
  if (variant === "warning") return <AlertTriangleIcon />
  if (variant === "info") return <InfoIcon />
  return <CircleHelpIcon />
}

export function ConfirmAlertDialogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pending, setPending] = useState<PendingConfirmation | null>(null)
  const pendingRef = useRef<PendingConfirmation | null>(null)

  const confirm = useCallback(
    (options: ConfirmAlertDialogOptions) =>
      new Promise<boolean>((resolve) => {
        pendingRef.current?.resolve(false)

        const nextConfirmation = { ...options, resolve }
        pendingRef.current = nextConfirmation
        setPending(nextConfirmation)
      }),
    []
  )

  const settle = useCallback((confirmed: boolean) => {
    const current = pendingRef.current
    if (!current) return

    pendingRef.current = null
    setPending(null)
    current.resolve(confirmed)
  }, [])

  const value = useMemo(() => ({ confirm }), [confirm])
  const variant = pending?.variant ?? "default"

  return (
    <ConfirmAlertDialogContext.Provider value={value}>
      {children}
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) settle(false)
        }}
      >
        <AlertDialogContent size="lg">
          <AlertDialogHeader>
            <AlertDialogMedia className={variantStyles[variant]}>
              <ConfirmationIcon variant={variant} />
            </AlertDialogMedia>
            <AlertDialogTitle>{pending?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => settle(false)}>
              {pending?.cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={() => settle(true)}
            >
              {pending?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmAlertDialogContext.Provider>
  )
}

export function useConfirmAlertDialog() {
  const context = useContext(ConfirmAlertDialogContext)

  if (!context) {
    throw new Error(
      "useConfirmAlertDialog must be used within ConfirmAlertDialogProvider"
    )
  }

  return context.confirm
}
