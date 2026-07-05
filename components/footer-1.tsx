import Link from "next/link"
import { LockKeyhole, Mail } from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { Logo } from "@/components/logo"
import { landingContent } from "@/lib/landing-content"

const COPYRIGHT_YEAR = 2026

export default function Footer() {
  const { locale } = useLandingLocale()
  const copy = landingContent[locale]
  const links = [
    { label: copy.nav.home, href: "/" },
    { label: copy.nav.products, href: "/products" },
    { label: copy.nav.contact, href: "/contact" },
  ]

  return (
    <footer
      id="site-footer"
      className="scroll-mt-24 border-t border-white/10 bg-zinc-950 text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr_1fr]">
          <div>
            <Link href="/" aria-label={copy.nav.home}>
              <Logo className="text-xl font-semibold tracking-tight text-white" />
            </Link>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/55">
              {copy.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/40 uppercase">
              {copy.footer.navigation}
            </h3>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white/40 uppercase">
              {copy.footer.system}
            </h3>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <LockKeyhole className="size-4 text-orange-400" />
                {copy.footer.access}
              </div>
              <p className="mt-2 text-xs leading-5 text-white/50">
                {copy.footer.accessDescription}
              </p>
            </div>
            <a
              href="mailto:support@vallerparts.co.tz"
              className="mt-4 flex items-center gap-2 text-sm text-white/65 hover:text-white"
            >
              <Mail className="size-4 text-orange-400" />
              {copy.footer.emailLabel}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {COPYRIGHT_YEAR} Valler Parts. {copy.footer.rights}
          </p>
          <p>🇹🇿 Dar es Salaam, Tanzania</p>
        </div>
      </div>
    </footer>
  )
}
