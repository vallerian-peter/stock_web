"use client"

import Image from "next/image"
import { LockKeyhole } from "lucide-react"

import Footer from "@/components/footer-1"
import { HeroHeader } from "@/components/header"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { landingContent } from "@/lib/landing-content"

export default function ProductsPage() {
  const { locale } = useLandingLocale()
  const copy = landingContent[locale]

  return (
    <>
      <HeroHeader />
      <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(234,88,12,0.13),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black,transparent_80%)] bg-[size:72px_72px]" />

        <section className="relative mx-auto max-w-7xl px-6 pt-36 pb-20 lg:px-8 lg:pt-44 lg:pb-28">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-orange-400 uppercase">
              {copy.productsPage.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl font-heading text-4xl leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-5xl">
              {copy.productsPage.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
              {copy.productsPage.description}
            </p>
            <p className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
              <LockKeyhole className="size-3 text-orange-400" />
              {copy.productsPage.note}
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {copy.products.cards.map((part) => (
              <article
                key={part.name}
                className="group relative h-[270px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/15 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-black/20" />
                <div className="relative">
                  <p className="text-[10px] tracking-wide text-white/40 uppercase">
                    {part.category}
                  </p>
                  <h2 className="mt-1 text-base font-medium">{part.name}</h2>
                </div>
                <div className="relative mx-auto mt-2 h-48 max-w-xs">
                  <Image
                    src={part.image}
                    alt={part.name}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-contain drop-shadow-[0_20px_24px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
