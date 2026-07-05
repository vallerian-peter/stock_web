import { Suspense, type ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getCurrentDashboardUser } from "@/lib/auth/current-dashboard-user"

async function AuthenticatedDashboardShell({
  children,
}: {
  children: ReactNode
}) {
  const user = await getCurrentDashboardUser()

  return <DashboardShell user={user}>
    {children}
  </DashboardShell>
}

function DashboardLoadingShell() {
  return (
    <div className="grid min-h-svh min-w-0 grid-cols-[72px_minmax(0,1fr)] bg-muted/30 md:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="border-r border-border/60 bg-background p-4">
        <div className="h-10 animate-pulse rounded-2xl bg-muted" />
      </aside>
      <div className="min-w-0">
        <div className="h-12 animate-pulse border-b border-border/60 bg-background" />
        <main>
          <div className="h-20 animate-pulse border-b border-border/60 bg-muted/60" />
          <div className="p-4 sm:p-6">
            <div className="h-72 animate-pulse rounded-2xl bg-muted" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<DashboardLoadingShell />}>
      <AuthenticatedDashboardShell>{children}</AuthenticatedDashboardShell>
    </Suspense>
  )
}
