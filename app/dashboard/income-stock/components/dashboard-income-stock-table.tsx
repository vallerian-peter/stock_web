"use client"

import { EyeIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react"

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
import type { IncomingStockResponseDTO } from "@/api/incoming_stocks_api"
import type { IncomeStockDialogCopy } from "./income-stock-dialog-copy"
import { useLandingLocale } from "@/components/landing-locale-provider"

type DashboardIncomeStockTableProps = {
  copy: IncomeStockDialogCopy
  formatReceivedAt: (value: string) => string
  onDeleteIntake: (intake: IncomingStockResponseDTO) => void
  onViewIntake: (intake: IncomingStockResponseDTO) => void
  pageStartIndex: number
  visibleIntakes: IncomingStockResponseDTO[]
}

export function DashboardIncomeStockTable({
  copy,
  formatReceivedAt,
  onDeleteIntake,
  onViewIntake,
  pageStartIndex,
  visibleIntakes,
}: DashboardIncomeStockTableProps) {
  const { locale } = useLandingLocale()
  const numberLocale = locale === "sw" ? "sw-TZ" : "en-TZ"

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{copy.invoiceNumber}</TableHead>
          <TableHead>{copy.supplierName}</TableHead>
          <TableHead>{copy.totalAmount}</TableHead>
          <TableHead>{copy.loggedBy}</TableHead>
          <TableHead>{copy.receivedAt}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleIntakes.map((intake, index) => (
          <TableRow key={intake.id}>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell className="font-mono text-xs">{intake.invoiceNumber || "—"}</TableCell>
            <TableCell className="font-medium">{intake.supplierName || "—"}</TableCell>
            <TableCell className="font-semibold text-orange-600 dark:text-orange-400">
              TZS {Number(intake.totalAmount).toLocaleString(numberLocale)}
            </TableCell>
            <TableCell>{intake.receivedByName || "—"}</TableCell>
            <TableCell>{formatReceivedAt(intake.receivedAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={copy.openActions}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onViewIntake(intake)}>
                    <EyeIcon />
                    {copy.viewTitle}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteIntake(intake)}
                  >
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
