"use client"

import { type ReactNode, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { Logo } from "@/components/logo"
import { landingContent } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

type HeroHeaderClientProps = {
  authAction: ReactNode
}

export function HeroHeaderClient({ authAction }: HeroHeaderClientProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { locale, setLocale } = useLandingLocale()
  const copy = landingContent[locale].nav
  const menuItems = [
    { name: copy.home, href: "/" },
    { name: copy.products, href: "/products" },
    { name: copy.contact, href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header>
      <nav
        className="fixed z-50 w-full px-3 pt-2"
        aria-label={copy.mainNavigation}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-2xl px-4 text-white transition-all duration-300 sm:px-6 lg:px-8",
            isScrolled &&
              "max-w-6xl border border-white/10 bg-zinc-950/80 shadow-2xl shadow-black/15 backdrop-blur-xl"
          )}
        >
          <div className="relative flex min-h-16 flex-wrap items-center justify-between gap-4 py-2 lg:flex-nowrap">
            <Link href="/" aria-label={copy.home}>
              <Logo className="text-lg font-semibold tracking-tight text-white" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? copy.closeMenu : copy.openMenu}
              className="relative z-20 -m-2 cursor-pointer rounded-lg p-2 hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>

            <ul className="absolute inset-0 m-auto hidden size-fit gap-8 text-[13px] lg:flex">
              {menuItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "relative block py-2 font-medium text-white/65 transition-colors hover:text-white",
                        isActive && "text-white"
                      )}
                    >
                      {item.name}
                      {isActive && (
                        <span className="absolute inset-x-1/4 bottom-0 h-px rounded-full bg-orange-400" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div
              className={cn(
                "w-full rounded-2xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl lg:ml-auto lg:flex lg:w-auto lg:items-center lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
                menuOpen ? "block" : "hidden lg:flex"
              )}
            >
              <ul className="mb-6 space-y-4 text-sm lg:hidden">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative w-fit pb-1 font-medium text-white/65 hover:text-white",
                          isActive && "text-white"
                        )}
                      >
                        {item.name}
                        {isActive && (
                          <span className="absolute inset-x-1/4 bottom-0 h-px rounded-full bg-orange-400" />
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  className="flex w-fit items-center rounded-full border border-white/15 bg-white/5 p-1"
                  aria-label={copy.language}
                >
                  <button
                    type="button"
                    onClick={() => setLocale("en")}
                    aria-pressed={locale === "en"}
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-white/65 transition",
                      locale === "en" && "bg-white text-zinc-950"
                    )}
                  >
                    <span aria-hidden="true">🇺🇸</span>
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocale("sw")}
                    aria-pressed={locale === "sw"}
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-medium text-white/65 transition",
                      locale === "sw" && "bg-white text-zinc-950"
                    )}
                  >
                    <span aria-hidden="true">🇹🇿</span>
                    SW
                  </button>
                </div>
                {authAction}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
