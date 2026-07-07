"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  BadgeDollarSignIcon,
  BarChart3Icon,
  ChevronRightIcon,
  ChevronDownIcon,
  CircleHelpIcon,
  CreditCardIcon,
  HandCoinsIcon,
  HomeIcon,
  LogOutIcon,
  Package2Icon,
  PanelLeftIcon,
  Settings2Icon,
  ShieldCheckIcon,
  TagIcon,
  UserCircle2Icon,
  Users2Icon,
  User2Icon,
  BellIcon,
  MenuIcon,
} from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useConfirmAlertDialog } from "@/components/confirm-alert-dialog-provider"
import { logout } from "@/api/auth_api"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  dashboardContent,
  type DashboardSectionKey,
} from "@/lib/dashboard-content"
import { canAccessDashboardSection } from "@/lib/auth/role-access"
import type { DashboardUser } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "../ui/badge"

type DashboardShellProps = {
  children: React.ReactNode
  user: DashboardUser
}

type NavItem = {
  key: DashboardSectionKey
  href: string
  icon: React.ComponentType<React.ComponentProps<"svg">>
}

const primaryNav: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: HomeIcon },
  { key: "users", href: "/dashboard/users", icon: Users2Icon },
  { key: "categories", href: "/dashboard/categories", icon: TagIcon },
  { key: "products", href: "/dashboard/products", icon: Package2Icon },
  {
    key: "incomeStock",
    href: "/dashboard/income-stock",
    icon: ArrowDownToLineIcon,
  },
  { key: "outgoing", href: "/dashboard/outgoing", icon: ArrowUpFromLineIcon },
  { key: "sales", href: "/dashboard/sales", icon: BadgeDollarSignIcon },
]

const secondaryNav: NavItem[] = [
  { key: "analytics", href: "/dashboard/analytics", icon: BarChart3Icon },
  { key: "settings", href: "/dashboard/settings", icon: Settings2Icon },
  { key: "helpCenter", href: "/dashboard/help-center", icon: CircleHelpIcon },
]

const debtNav: NavItem[] = [
  {
    key: "payable",
    href: "/dashboard/debts/payable",
    icon: CreditCardIcon,
  },
  {
    key: "receivable",
    href: "/dashboard/debts/receivable",
    icon: HandCoinsIcon,
  },
]

const navButtonClassName =
  "h-9! cursor-pointer rounded-xl border border-transparent px-3! py-1.5! text-[12px] font-normal text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:border-sidebar-border data-active:bg-sidebar-foreground data-active:font-semibold data-active:text-sidebar data-active:shadow-sm data-active:hover:bg-sidebar-foreground data-active:hover:text-sidebar group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!"

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function LocaleToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLandingLocale()
  const copy = dashboardContent[locale]

  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border/70 bg-background/70 p-1",
        compact && "w-full justify-between"
      )}
      aria-label={copy.shell.language}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-medium transition",
          locale === "en"
            ? "bg-orange-500 text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("sw")}
        aria-pressed={locale === "sw"}
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] font-medium transition",
          locale === "sw"
            ? "bg-orange-500 text-white"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        SW
      </button>
    </div>
  )
}

function AccountMenu({
  user,
  align = "end",
  compact = false,
}: {
  user: DashboardUser
  align?: "start" | "center" | "end"
  compact?: boolean
}) {
  const { locale } = useLandingLocale()
  const copy = dashboardContent[locale]
  const confirm = useConfirmAlertDialog()
  const router = useRouter()

  const handleSignOut = async () => {
    const isConfirmed = await confirm({
      title: copy.shell.signOutConfirmTitle,
      description: copy.shell.signOutConfirmDescription,
      confirmLabel: copy.shell.signOut,
      cancelLabel: copy.shell.cancel,
      variant: "destructive",
    })

    if (!isConfirmed) {
      return
    }

    await logout()
    router.push("/auth/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-left transition group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 hover:bg-muted/70",
          compact && "px-2.5 py-2"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-gray-700 dark:text-gray-300">
          <User2Icon className="size-4.5" />
        </div>
        <div
          className={cn(
            "min-w-0 flex-1 group-data-[collapsible=icon]:hidden",
            compact && "hidden md:block"
          )}
        >
          <p className="truncate text-[12px] font-medium text-foreground">
            {user.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user.email}
          </p>
        </div>
        <ChevronDownIcon className="size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className="w-64 rounded-2xl p-2"
      >
        <DropdownMenuItem
          className="gap-2 rounded-xl px-3 py-2 text-[12px]"
          render={<Link href="/dashboard/account" />}
        >
          <UserCircle2Icon />
          {copy.shell.profile}
        </DropdownMenuItem>
        {canAccessDashboardSection(user.role, "settings") ? (
          <DropdownMenuItem
            className="gap-2 rounded-xl px-3 py-2 text-[12px]"
            render={<Link href="/dashboard/settings" />}
          >
            <Settings2Icon />
            {copy.nav.settings}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2 rounded-xl px-3 py-2 text-[12px]"
          onClick={() => setTimeout(handleSignOut, 80)}
        >
          <LogOutIcon />
          {copy.shell.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DashboardSidebar({ user }: { user: DashboardUser }) {
  const pathname = usePathname()
  const { locale } = useLandingLocale()
  const copy = dashboardContent[locale]
  const [debtsOpen, setDebtsOpen] = useState(() =>
    pathname.startsWith("/dashboard/debts")
  )
  const debtsActive = pathname.startsWith("/dashboard/debts")

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r-0 md:p-3">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-600">
            <ShieldCheckIcon className="size-4.5" />
          </div>
          <Logo className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 group-data-[collapsible=icon]:px-1">
        <SidebarGroup className="py-0 group-data-[collapsible=icon]:px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav
                .filter(({ key }) => canAccessDashboardSection(user.role, key))
                .map(({ key, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActivePath(pathname, href)}
                      tooltip={copy.nav[key]}
                      className={navButtonClassName}
                    >
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {copy.nav[key]}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

              {debtNav.some(({ key }) =>
                canAccessDashboardSection(user.role, key)
              ) ? (
                <>
                  <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuButton
                      type="button"
                      isActive={debtsActive}
                      tooltip={copy.shell.debtsLabel}
                      className={navButtonClassName}
                      aria-expanded={debtsOpen}
                      onClick={() => setDebtsOpen((open) => !open)}
                    >
                      <HandCoinsIcon />
                      <span>{copy.shell.debtsLabel}</span>
                      <ChevronRightIcon
                        className={cn(
                          "ml-auto size-3.5 transition-transform",
                          debtsOpen && "rotate-90"
                        )}
                      />
                    </SidebarMenuButton>
                    {debtsOpen ? (
                      <SidebarMenuSub className="mt-1 gap-1">
                        {debtNav
                          .filter(({ key }) =>
                            canAccessDashboardSection(user.role, key)
                          )
                          .map(({ key, href, icon: Icon }) => (
                            <SidebarMenuSubItem key={href}>
                              <SidebarMenuSubButton
                                render={<Link href={href} />}
                                isActive={isActivePath(pathname, href)}
                                className="h-8 rounded-lg px-2.5 py-1.5 text-[12px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:font-semibold data-active:text-sidebar-foreground"
                              >
                                <Icon />
                                <span>{copy.nav[key]}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>

                  {debtNav
                    .filter(({ key }) =>
                      canAccessDashboardSection(user.role, key)
                    )
                    .map(({ key, href, icon: Icon }) => (
                      <SidebarMenuItem
                        key={href}
                        className="hidden group-data-[collapsible=icon]:block"
                      >
                        <SidebarMenuButton
                          render={<Link href={href} />}
                          isActive={isActivePath(pathname, href)}
                          tooltip={copy.nav[key]}
                          className={navButtonClassName}
                        >
                          <Icon />
                          <span className="sr-only">{copy.nav[key]}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </>
              ) : null}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 border-t border-sidebar-border/60 px-2 py-3 group-data-[collapsible=icon]:px-1">
        <SidebarGroup className="px-0 py-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav
                .filter(({ key }) => canAccessDashboardSection(user.role, key))
                .map(({ key, href, icon: Icon }) => (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={isActivePath(pathname, href)}
                      tooltip={copy.nav[key]}
                      className={navButtonClassName}
                    >
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {copy.nav[key]}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="border-t border-sidebar-border/70 pt-3 group-data-[collapsible=icon]:px-0">
          <AccountMenu user={user} align="start" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function DashboardTopBar({ user }: { user: DashboardUser }) {
  const { locale } = useLandingLocale()
  const { state, toggleSidebar, isMobile } = useSidebar()
  const copy = dashboardContent[locale]

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-1 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          className="rounded-xl"
          onClick={toggleSidebar}
          aria-label={
            isMobile
              ? copy.shell.openSidebar
              : state === "collapsed"
                ? copy.shell.expandSidebar
                : copy.shell.collapseSidebar
          }
        >
          {isMobile 
            ? <MenuIcon /> 
            : <PanelLeftIcon
                className={cn(
                "transition-transform",
                !isMobile && state === "collapsed" && "rotate-180"
              )}
            /> 
          }
        </Button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LocaleToggle />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="relative z-0 bg-muted/20"
            aria-label={copy.shell.notifications}
          >
            <BellIcon />
            {/* <span className="absolute -top-0.5 left-6 size-2 rounded-full bg-orange-500" /> */}
            <Badge className="absolute top-0 left-4 size-4 border-2 border-gray-100 px-2.5 text-[10px] dark:border-gray-900">
              +9
            </Badge>
          </Button>
          <div className="hidden sm:block">
            <AccountMenu user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

function DashboardFooter() {
  return (
    <div className="sticky bottom-0 z-30 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="flex flex-row items-center justify-between px-10 pt-3 pb-2 text-[11px]!">
        <span>
          &copy;2026 <Logo />. All rights reserved
        </span>
        <span>Developed and Designed by Vallerian</span>
      </div>
    </div>
  )
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar user={user} />
      <SidebarInset className="min-h-auto min-w-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.96))] dark:bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.08),_transparent_28%),linear-gradient(180deg,rgba(9,9,11,0.96),rgba(18,18,22,0.98))]">
        <DashboardTopBar user={user} />
        <main className="flex min-w-0 flex-1 flex-col">
          {children}
          <DashboardFooter />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
