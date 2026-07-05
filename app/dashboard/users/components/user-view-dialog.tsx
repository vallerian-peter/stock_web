"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"

import type { UserDialogCopy } from "./user-dialog-copy"

type UserViewDialogProps = {
  copy: UserDialogCopy
  user: UserResponseDTO
  onClose: () => void
}

export function UserViewDialog({ copy, user, onClose }: UserViewDialogProps) {
  const details = [
    [copy.firstName, user.firstName],
    [copy.lastName, user.lastName],
    [copy.email, user.email],
    [copy.phone, user.phone],
    [copy.role, user.role === "admin" ? copy.admin : copy.user],
    [copy.createdAt, user.createdAt],
  ]


  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{copy.viewTitle}</DialogTitle>
          <DialogDescription>{copy.viewDescription}</DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="space-y-1">
              <dt className="text-[13px] text-muted-foreground">
                {label}
              </dt>
              <dd className="text-[15px] font-medium break-words">{value}</dd>
            </div>
          ))}
          <div className="space-y-1">
            <dt className="text-[15px] text-muted-foreground">{copy.status}</dt>
            <dd>
              <Badge
                variant={user.status === "Active" ? "default" : "destructive"}
              >
                {user.status === "Active" ? copy.active : copy.inactive}
              </Badge>
            </dd>
          </div>
        </dl>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {copy.close}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
