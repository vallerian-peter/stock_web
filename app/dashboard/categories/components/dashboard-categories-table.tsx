"use client"

import {
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"

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
import type { CategoryResponseDTO } from "@/lib/dtos/category_dtos"
import type { DashboardCategoriesCopy } from "@/lib/types"

type DashboardCategoriesTableProps = {
  allVisibleCategoriesSelected: boolean
  copy: DashboardCategoriesCopy
  formatCreatedAt: (value: string) => string
  onDeleteCategory: (category: CategoryResponseDTO) => void
  onEditCategory: (category: CategoryResponseDTO) => void
  onToggleCategorySelection: (categoryId: number, checked: boolean) => void
  onToggleVisibleCategories: (checked: boolean) => void
  onViewCategory: (category: CategoryResponseDTO) => void
  pageStartIndex: number
  selectedCategoryIds: Set<number>
  someVisibleCategoriesSelected: boolean
  visibleCategories: CategoryResponseDTO[]
}

export function DashboardCategoriesTable({
  allVisibleCategoriesSelected,
  copy,
  formatCreatedAt,
  onDeleteCategory,
  onEditCategory,
  onToggleCategorySelection,
  onToggleVisibleCategories,
  onViewCategory,
  pageStartIndex,
  selectedCategoryIds,
  someVisibleCategoriesSelected,
  visibleCategories,
}: DashboardCategoriesTableProps) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-10">
            <Checkbox
              checked={allVisibleCategoriesSelected}
              indeterminate={someVisibleCategoriesSelected}
              onCheckedChange={onToggleVisibleCategories}
              aria-label={copy.selectAll}
            />
          </TableHead>
          <TableHead>{copy.number}</TableHead>
          <TableHead>{copy.name}</TableHead>
          <TableHead>{copy.createdAt}</TableHead>
          <TableHead className="w-12">
            <span className="sr-only">{copy.actions}</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleCategories.map((category, index) => (
          <TableRow
            key={category.id}
            data-state={
              selectedCategoryIds.has(category.id) ? "selected" : undefined
            }
          >
            <TableCell>
              <Checkbox
                checked={selectedCategoryIds.has(category.id)}
                onCheckedChange={(checked) =>
                  onToggleCategorySelection(category.id, checked)
                }
                aria-label={`${copy.selectCategory}: ${category.name}`}
              />
            </TableCell>
            <TableCell>{pageStartIndex + index + 1}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{formatCreatedAt(category.createdAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`${copy.openActions} ${category.name}`}
                    >
                      <MoreVerticalIcon />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem onClick={() => onViewCategory(category)}>
                    <EyeIcon />
                    {copy.viewCategory}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCategory(category)}>
                    <PencilIcon />
                    {copy.editCategory}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteCategory(category)}
                  >
                    <Trash2Icon />
                    {copy.deleteCategory}
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
