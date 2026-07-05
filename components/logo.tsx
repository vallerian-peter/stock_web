import { cn } from "@/lib/utils"

export function Logo({ className }: {className?: string}) {
  return (
    <span className={cn("text-medium", className)}>
      Valler <span className="text-orange-600">PARTS</span>
    </span>
  )
}
