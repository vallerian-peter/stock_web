"use client"

import Link from "next/link"
import { ArrowRight, Clock3, LockKeyhole, Mail, MapPin } from "lucide-react"
import Footer from "@/components/footer-1"
import { HeroHeader } from "@/components/header"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { buttonVariants } from "@/components/ui/button"
import { landingContent } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

export default function ContactPage() {
  const { locale } = useLandingLocale()
  const copy = landingContent[locale]
  const details = [
    {
      icon: Mail,
      label: copy.contactPage.email,
      value: copy.contactPage.emailValue,
    },
    {
      icon: MapPin,
      label: copy.contactPage.location,
      value: copy.contactPage.locationValue,
    },
    {
      icon: Clock3,
      label: copy.contactPage.hours,
      value: copy.contactPage.hoursValue,
    },
  ]

  return (
    <>
      <HeroHeader />
      <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(234,88,12,0.12),transparent_32%)]" />

        <section className="relative mx-auto grid max-w-6xl gap-14 px-6 pt-36 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-44 lg:pb-28">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-orange-400 uppercase">
              {copy.contactPage.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl font-heading text-4xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
              {copy.contactPage.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
              {copy.contactPage.description}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {details.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-[10px] tracking-wide text-white/40 uppercase">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-white/80">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <LockKeyhole className="size-5" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold tracking-tight">
              {copy.contactPage.supportTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              {copy.contactPage.supportDescription}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${copy.contactPage.emailValue}`}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-10 rounded-full bg-orange-600 px-5 text-xs text-white hover:bg-orange-500"
                )}
              >
                <Mail className="size-3.5" />
                {copy.contactPage.emailAction}
              </a>
              <Link
                href="/auth/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-10 rounded-full border-white/15 bg-white/5 px-5 text-xs text-white hover:bg-white/10 hover:text-white"
                )}
              >
                {copy.contactPage.loginAction}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  )
}
