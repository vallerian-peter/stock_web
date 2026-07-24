"use client"

import { EyeIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { cn } from "@/lib/utils"

import type { DebtDialogCopy, DebtRecordView } from "./debt-feature-types"

type DashboardDebtTableProps = {
  copy: DebtDialogCopy
  formatDate: (value: string) => string
  numberLocale: string
  onDelete: (record: DebtRecordView) => void
  onView: (record: DebtRecordView) => void
  pageStartIndex: number
  visibleRecords: DebtRecordView[]
}

function statusBadge(copy: DebtDialogCopy, status: DebtRecordView["status"]) {
  const styles = {
    PAID: "bg-green-500/10 text-green-700 dark:text-green-300",
    PARTIAL: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  }
  const labels = {
    PAID: copy.statusPaid,
    PARTIAL: copy.statusPartial,
    PENDING: copy.statusPending,
  }

  return (
    <Badge className={cn("rounded-md border-0 px-2 py-0.5 text-[10px]", styles[status])}>
      {labels[status]}
    </Badge>
  )
}

export function DashboardDebtTable({
  copy,
  formatDate,
  numberLocale,
  onDelete,
  onView,
  pageStartIndex,
  visibleRecords,
}: DashboardDebtTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{copy.partyName}</TableHead>
          <TableHead>{copy.referenceNumber}</TableHead>
          <TableHead>{copy.status}</TableHead>
          <TableHead>{copy.totalAmount}</TableHead>
          <TableHead>{copy.balanceAmount}</TableHead>
          <TableHead>{copy.debtDate}</TableHead>
          <TableHead>{copy.dueDate}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleRecords.map((record, index) => (
          <TableRow key={record.id}>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell>
              <p className="font-medium">{record.partyName}</p>
              {record.partyPhone ? (
                <p className="text-xs text-muted-foreground">{record.partyPhone}</p>
              ) : null}
            </TableCell>
            <TableCell className="font-mono text-xs">
              {record.referenceNumber || "—"}
            </TableCell>
            <TableCell>{statusBadge(copy, record.status)}</TableCell>
            <TableCell className="font-semibold">
              TZS {Number(record.totalAmount).toLocaleString(numberLocale)}
            </TableCell>
            <TableCell className="font-bold text-orange-600 dark:text-orange-400">
              TZS {Number(record.balanceAmount).toLocaleString(numberLocale)}
            </TableCell>
            <TableCell>{record.debtDate ? formatDate(record.debtDate) : "—"}</TableCell>
            <TableCell>{record.dueDate ? formatDate(record.dueDate) : "—"}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button type="button" variant="ghost" size="icon" aria-label={copy.openActions}>
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onView(record)}>
                    <EyeIcon />
                    {copy.viewTitle}
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => onDelete(record)}>
                    <Trash2Icon />
                    {copy.confirmDelete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
