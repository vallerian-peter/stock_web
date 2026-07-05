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
import type { PartResponseDTO } from "@/lib/dtos/part_dtos"
import type { DashboardPartsCopy } from "@/lib/types"

type DashboardProductsTableProps = {
  allVisiblePartsSelected: boolean
  copy: DashboardPartsCopy
  formatCreatedAt: (value: string) => string
  formatPrice: (value: string) => string
  onDeletePart: (part: PartResponseDTO) => void
  onEditPart: (part: PartResponseDTO) => void
  onTogglePartSelection: (partId: number, checked: boolean) => void
  onToggleVisibleParts: (checked: boolean) => void
  onViewPart: (part: PartResponseDTO) => void
  pageStartIndex: number
  selectedPartIds: Set<number>
  someVisiblePartsSelected: boolean
  visibleParts: PartResponseDTO[]
}

function resolveStatusBadge(copy: DashboardPartsCopy, status: PartResponseDTO["status"]) {
  if (status === "low_stock") {
    return <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-300">{copy.lowStock}</Badge>
  }

  if (status === "out_of_stock") {
    return <Badge variant="destructive">{copy.outOfStock}</Badge>
  }

  return <Badge className="bg-green-500/20 text-green-800 dark:text-green-300">{copy.inStock}</Badge>
}

export function DashboardProductsTable({
  allVisiblePartsSelected,
  copy,
  formatCreatedAt,
  formatPrice,
  onDeletePart,
  onEditPart,
  onTogglePartSelection,
  onToggleVisibleParts,
  onViewPart,
  pageStartIndex,
  selectedPartIds,
  someVisiblePartsSelected,
  visibleParts,
}: DashboardProductsTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allVisiblePartsSelected}
              indeterminate={someVisiblePartsSelected}
              onCheckedChange={onToggleVisibleParts}
              aria-label={copy.selectAll}
            />
          </TableHead>
          <TableHead>{copy.number}</TableHead>
          <TableHead>{copy.partName}</TableHead>
          <TableHead>{copy.partNumber}</TableHead>
          <TableHead>{copy.category}</TableHead>
          <TableHead>{copy.quantity}</TableHead>
          <TableHead>{copy.price}</TableHead>
          <TableHead>{copy.status}</TableHead>
          <TableHead>{copy.createdAt}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleParts.map((part, index) => (
          <TableRow
            key={part.id}
            data-state={
              selectedPartIds.has(part.id) ? "selected" : undefined
            }
          >
            <TableCell>
              <Checkbox
                checked={selectedPartIds.has(part.id)}
                onCheckedChange={(checked) =>
                  onTogglePartSelection(part.id, checked)
                }
                aria-label={`${copy.selectPart}: ${part.partName}`}
              />
            </TableCell>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell>{part.partName}</TableCell>
            <TableCell>{part.partNumber}</TableCell>
            <TableCell>{part.categoryName ?? copy.uncategorized}</TableCell>
            <TableCell>{part.quantity}</TableCell>
            <TableCell>{formatPrice(part.price)}</TableCell>
            <TableCell>{resolveStatusBadge(copy, part.status)}</TableCell>
            <TableCell>{formatCreatedAt(part.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`${copy.openActions} ${part.partName}`}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onViewPart(part)}>
                    <EyeIcon />
                    {copy.viewPart}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditPart(part)}>
                    <PencilIcon />
                    {copy.editPart}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeletePart(part)}
                  >
                    <Trash2Icon />
                    {copy.deletePart}
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
