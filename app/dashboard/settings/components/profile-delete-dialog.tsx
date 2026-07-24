"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"

import { deleteOwnAccount } from "@/api/account_api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { clearAccessToken } from "@/lib/api/axios"
import { getApiErrorMessage } from "@/lib/api/request"
import { clearAuthSession } from "@/lib/auth/auth-session"

import type { SettingsCopy } from "./settings-copy"
import { SettingsFormField } from "./settings-controls"

export function ProfileDeleteDialog({
  open,
  copy,
  onOpenChange,
}: {
  open: boolean
  copy: SettingsCopy["profile"]
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState<string>()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      setPassword("")
      setError(undefined)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!password.trim()) {
      setError(copy.validation.deletePassword)
      return
    }

    try {
      setIsSubmitting(true)
      const response = await deleteOwnAccount({ currentPassword: password })

      toast.success(response.message)
      clearAccessToken()
      clearAuthSession()
      router.replace("/auth/login")
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.deleteDialogTitle}</DialogTitle>
          <DialogDescription>{copy.deleteDialogDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate>
          <SettingsFormField
            autoFocus
            required
            type="password"
            autoComplete="current-password"
            label={copy.oldPassword}
            value={password}
            error={error}
            disabled={isSubmitting}
            onChange={(event) => {
              setPassword(event.target.value)
              setError(undefined)
            }}
          />
          <DialogFooter className="mt-5">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
            >
              {copy.cancel}
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : <Trash2Icon />}
              {copy.confirmDelete}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
