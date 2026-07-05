"use client"

import {
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { UserResponseDTO } from "@/lib/dtos/user_dtos"
import type { DashboardUsersCopy } from "@/lib/types"

function isProtectedUser(user: UserResponseDTO) {
  return user.role === "admin"
}

type DashboardUsersTableProps = {
  allVisibleUsersSelected: boolean
  copy: DashboardUsersCopy
  formatCreatedAt: (value: string) => string
  onDeleteUser: (user: UserResponseDTO) => void
  onEditUser: (user: UserResponseDTO) => void
  onToggleUserSelection: (userId: number, checked: boolean) => void
  onToggleVisibleUsers: (checked: boolean) => void
  onViewUser: (user: UserResponseDTO) => void
  pageStartIndex: number
  selectedUserIds: Set<number>
  someVisibleUsersSelected: boolean
  visibleUsers: UserResponseDTO[]
}

export function DashboardUsersTable({
  allVisibleUsersSelected,
  copy,
  formatCreatedAt,
  onDeleteUser,
  onEditUser,
  onToggleUserSelection,
  onToggleVisibleUsers,
  onViewUser,
  pageStartIndex,
  selectedUserIds,
  someVisibleUsersSelected,
  visibleUsers,
}: DashboardUsersTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allVisibleUsersSelected}
              indeterminate={someVisibleUsersSelected}
              onCheckedChange={onToggleVisibleUsers}
              aria-label={copy.selectAll}
            />
          </TableHead>
          <TableHead>{copy.number}</TableHead>
          <TableHead>{copy.fullName}</TableHead>
          <TableHead>{copy.email}</TableHead>
          <TableHead>{copy.phone}</TableHead>
          <TableHead>{copy.role}</TableHead>
          <TableHead>{copy.status}</TableHead>
          <TableHead>{copy.createdAt}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleUsers.map((user, index) => (
          <TableRow
            key={user.id}
            data-state={selectedUserIds.has(user.id) ? "selected" : undefined}
          >
            <TableCell>
              <Checkbox
                checked={selectedUserIds.has(user.id)}
                onCheckedChange={(checked) =>
                  onToggleUserSelection(user.id, checked)
                }
                disabled={isProtectedUser(user)}
                aria-label={`${copy.selectUser}: ${user.firstName} ${user.lastName}`}
              />
            </TableCell>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell>{user.fullName ?? `${user.firstName} ${user.lastName}`} {isProtectedUser(user) ? `(${copy.you})` : null}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{user.role.toUpperCase()}</TableCell>
            <TableCell>
              {user.status === "Active" ? (
                <Badge className="bg-green-500/20 text-green-800 dark:text-green-300 flex flex-row items-center justify-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-green-900 dark:bg-green-400" /> {copy.active}
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex flex-row items-center justify-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-red-900 dark:bg-red-400" />  {copy.inactive}
                </Badge>
              )}
            </TableCell>
            <TableCell>{formatCreatedAt(user.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`${copy.openActions} ${user.firstName} ${user.lastName}`}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onViewUser(user)}>
                    <EyeIcon />
                    {copy.viewUser}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    <PencilIcon />
                    {copy.editUser}
                  </DropdownMenuItem>
                  {isProtectedUser(user) ? null : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDeleteUser(user)}
                      >
                        <Trash2Icon />
                        {copy.deleteUser}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
