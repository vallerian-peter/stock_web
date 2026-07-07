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
import type { SaleResponseDTO } from "@/api/sales_api"
import type { SalesDialogCopy } from "./sales-dialog-copy"
import { cn } from "@/lib/utils"

type DashboardSalesTableProps = {
  copy: SalesDialogCopy
  formatSoldAt: (value: string) => string
  onDeleteSale: (sale: SaleResponseDTO) => void
  onViewSale: (sale: SaleResponseDTO) => void
  pageStartIndex: number
  visibleSales: SaleResponseDTO[]
}

export function DashboardSalesTable({
  copy,
  formatSoldAt,
  onDeleteSale,
  onViewSale,
  pageStartIndex,
  visibleSales,
}: DashboardSalesTableProps) {
  function getStatusBadge(status: string) {
    const s = status.toUpperCase()
    const colorMap: Record<string, string> = {
      PAID: "bg-green-500/10 text-green-700 dark:text-green-300",
      PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
      PARTIAL: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    }
    const colorClass = colorMap[s] || "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    return (
      <Badge className={cn("rounded-md border-0 px-2 py-0.5 text-[10px] font-medium", colorClass)}>
        {s}
      </Badge>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{copy.saleNumber}</TableHead>
          <TableHead>{copy.customerName}</TableHead>
          <TableHead>{copy.paymentStatus}</TableHead>
          <TableHead>{copy.paymentMethod}</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>{copy.loggedBy}</TableHead>
          <TableHead>{copy.soldAt}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleSales.map((sale, index) => (
          <TableRow key={sale.id}>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell className="font-mono text-xs">{sale.saleNumber || "—"}</TableCell>
            <TableCell className="font-medium">{sale.customerName || "—"}</TableCell>
            <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
            <TableCell className="text-xs font-semibold">{sale.paymentMethod || "—"}</TableCell>
            <TableCell className="font-bold text-orange-600 dark:text-orange-400">
              TZS {Number(sale.totalAmount).toLocaleString()}
            </TableCell>
            <TableCell>{sale.soldByName || "—"}</TableCell>
            <TableCell>{formatSoldAt(sale.soldAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Open Actions"
                    >
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onViewSale(sale)}>
                    <EyeIcon />
                    {copy.viewTitle}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteSale(sale)}
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
