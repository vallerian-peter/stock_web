"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon, ShieldAlertIcon, Trash2Icon } from "lucide-react"

import { logout } from "@/api/auth_api"
import { useConfirmAlertDialog } from "@/components/confirm-alert-dialog-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { ProfileDeleteDialog } from "./profile-delete-dialog"
import type { SettingsCopy } from "./settings-copy"

type AccountAction = "delete" | "logout"

export function ProfileAccountActions({
  canDeleteAccount,
  copy,
}: {
  canDeleteAccount: boolean
  copy: SettingsCopy["profile"]
}) {
  const router = useRouter()
  const confirm = useConfirmAlertDialog()
  const [pendingAction, setPendingAction] =
    React.useState<AccountAction | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  async function handleLogout() {
    const confirmed = await confirm({
      title: copy.logoutConfirmTitle,
      description: copy.logoutConfirmDescription,
      confirmLabel: copy.logout,
      cancelLabel: copy.cancel,
      variant: "destructive",
    })

    if (!confirmed) return

    try {
      setPendingAction("logout")
      await logout()
      router.replace("/auth/login")
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <>
      <section className="py-7">
        <AccountActionCard
          icon={<ShieldAlertIcon className="size-4" />}
          title={copy.dangerTitle}
          description={
            canDeleteAccount ? copy.dangerDescription : copy.deleteBlocked
          }
          action={
            <Button
              type="button"
              variant="destructive"
              className="sm:shrink-0"
              disabled={!canDeleteAccount}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2Icon />
              {copy.deleteAccount}
            </Button>
          }
        />
      </section>

      <section className="pt-7">
        <AccountActionCard
          icon={<LogOutIcon className="size-4" />}
          title={copy.logoutTitle}
          description={copy.logoutDescription}
          action={
            <Button
              type="button"
              variant="outline"
              className="sm:shrink-0"
              disabled={pendingAction === "logout"}
              onClick={() => void handleLogout()}
            >
              {pendingAction === "logout" ? <Spinner /> : <LogOutIcon />}
              {copy.logout}
            </Button>
          }
        />
      </section>

      <ProfileDeleteDialog
        open={deleteDialogOpen}
        copy={copy}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  )
}

function AccountActionCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          {icon}
        </span>
        <div>
          <h3 className="text-[12px] font-semibold">{title}</h3>
          <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {action}
    </div>
  )
}
