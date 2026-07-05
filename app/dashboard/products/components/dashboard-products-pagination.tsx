"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { DashboardPartsCopy } from "@/lib/types"

type DashboardProductsPaginationProps = {
  copy: DashboardPartsCopy
  currentPage: number
  firstVisiblePart: number
  lastVisiblePart: number
  onPageChange: (page: number) => void
  totalItems: number
  totalPages: number
}

export function DashboardProductsPagination({
  copy,
  currentPage,
  firstVisiblePart,
  lastVisiblePart,
  onPageChange,
  totalItems,
  totalPages,
}: DashboardProductsPaginationProps) {
  return (
    <>
      <p className="text-muted-foreground" aria-live="polite">
        {copy.showing} {firstVisiblePart}-{lastVisiblePart} {copy.of}{" "}
        {totalItems}
      </p>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text={copy.previous}
              aria-label={copy.previousPage}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : undefined
              }
              onClick={(event) => {
                event.preventDefault()
                onPageChange(currentPage - 1)
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  aria-label={`${copy.showing} ${page}`}
                  onClick={(event) => {
                    event.preventDefault()
                    onPageChange(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              text={copy.next}
              aria-label={copy.nextPage}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
              onClick={(event) => {
                event.preventDefault()
                onPageChange(currentPage + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
