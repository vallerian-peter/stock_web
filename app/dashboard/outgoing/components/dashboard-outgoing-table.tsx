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
import type { OutgoingStockResponseDTO } from "@/api/outgoing_stocks_api"
import type { OutgoingDialogCopy } from "./outgoing-dialog-copy"
import { cn } from "@/lib/utils"

type DashboardOutgoingTableProps = {
  copy: OutgoingDialogCopy
  formatDispatchedAt: (value: string) => string
  onDeleteDispatch: (dispatch: OutgoingStockResponseDTO) => void
  onViewDispatch: (dispatch: OutgoingStockResponseDTO) => void
  pageStartIndex: number
  visibleDispatches: OutgoingStockResponseDTO[]
}

export function DashboardOutgoingTable({
  copy,
  formatDispatchedAt,
  onDeleteDispatch,
  onViewDispatch,
  pageStartIndex,
  visibleDispatches,
}: DashboardOutgoingTableProps) {
  function getPurposeBadge(purpose: string) {
    const p = purpose.toUpperCase()
    const colorMap: Record<string, string> = {
      SALE: "bg-green-500/10 text-green-700 dark:text-green-300",
      DAMAGED: "bg-red-500/10 text-red-700 dark:text-red-300",
      RETURN: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    }
    const colorClass = colorMap[p] || "bg-gray-500/10 text-gray-700 dark:text-gray-300"
    const labels: Record<string, string> = {
      SALE: copy.purposeSale,
      DAMAGED: copy.purposeDamaged,
      RETURN: copy.purposeReturn,
    }
    return (
      <Badge className={cn("rounded-md border-0 px-2 py-0.5 text-[10px] font-medium", colorClass)}>
        {labels[p] || purpose}
      </Badge>
    )
  }

  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{copy.dispatchNumber}</TableHead>
          <TableHead>{copy.purpose}</TableHead>
          <TableHead>{copy.loggedBy}</TableHead>
          <TableHead>{copy.dispatchedAt}</TableHead>
          <TableHead>
            {copy.parts}
          </TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleDispatches.map((dispatch, index) => (
          <TableRow key={dispatch.id}>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell className="font-mono text-xs">{dispatch.dispatchNumber || "—"}</TableCell>
            <TableCell>{getPurposeBadge(dispatch.purpose)}</TableCell>
            <TableCell>{dispatch.dispatchedByName || "—"}</TableCell>
            <TableCell>{formatDispatchedAt(dispatch.dispatchedAt)}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {dispatch.items.map((item) => (
                  <Badge key={item.id} variant="outline" className="font-normal">
                    {item.partName} ({item.quantity})
                  </Badge>
                ))}
              </div>
            </TableCell>
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
                  <DropdownMenuItem onClick={() => onViewDispatch(dispatch)}>
                    <EyeIcon />
                    {copy.viewTitle}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteDispatch(dispatch)}
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
