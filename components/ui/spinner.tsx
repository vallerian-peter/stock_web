"use client"

import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import { useUiCopy } from "@/components/ui/ui-copy"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const copy = useUiCopy()

  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={copy.loading} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
