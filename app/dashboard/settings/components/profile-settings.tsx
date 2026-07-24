"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { ProfileAccountActions } from "./profile-account-actions"
import { ProfileDetailsForm } from "./profile-details-form"
import { ProfilePasswordForm } from "./profile-password-form"
import type { SettingsCopy } from "./settings-copy"
import { useAccountProfile } from "./use-account-profile"

export function ProfileSettings({ copy }: { copy: SettingsCopy["profile"] }) {
  const { account, loadError, reload, setAccount } = useAccountProfile(
    copy.loadFailed
  )

  if (loadError) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <p className="text-[11px] text-destructive">{loadError}</p>
        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() => void reload()}
        >
          {copy.retry}
        </Button>
      </div>
    )
  }

  if (!account) {
    return <ProfileFallback />
  }

  return (
    <div className="divide-y divide-border/60">
      <ProfileDetailsForm
        user={account.user}
        copy={copy}
        onUpdated={setAccount}
      />
      <ProfilePasswordForm copy={copy} />
      <ProfileAccountActions
        canDeleteAccount={account.canDeleteAccount}
        copy={copy}
      />
    </div>
  )
}

function ProfileFallback() {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  )
}
