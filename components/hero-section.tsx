"use client"

import { useState, useEffect } from 'react';
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, LockKeyhole } from "lucide-react"
import type { Variants } from "motion/react"

import Footer from "@/components/footer-1"
import { HeroHeader } from "@/components/header"
import { useLandingLocale } from "@/components/landing-locale-provider"
import { AnimatedGroup } from "@/components/motion-primitives/animated-group"
import { TextEffect } from "@/components/motion-primitives/text-effect"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { buttonVariants } from "@/components/ui/button"
import { landingContent } from "@/lib/landing-content"
import { cn } from "@/lib/utils"

const transitionVariants = {
  item: {
    hidden: { opacity: 0, filter: "blur(12px)", y: 18 },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { type: "spring", bounce: 0.25, duration: 1.2 },
    },
  },
} satisfies { item: Variants }

export default function HeroSection() {
  const { locale } = useLandingLocale()
  const copy = landingContent[locale]
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [isCarouselPaused, setIsCarouselPaused] = useState(false)

  useEffect(() => {
    if (!carouselApi || isCarouselPaused) return

    const interval = window.setInterval(() => {
      carouselApi.scrollNext()
    }, 3500)

    return () => window.clearInterval(interval)
  }, [carouselApi, isCarouselPaused])

  return (
    <>
      <HeroHeader />

      <main>
        <section
          id="home"
          className="relative isolate min-h-[820px] overflow-hidden bg-zinc-950 text-white lg:min-h-screen"
        >
          <Image
            src="/assets/images/Bonnet_Wallpaper copy.jpg"
            alt="Open car bonnet showing a complete engine bay"
            fill
            priority
            sizes="100vw"
            className="-z-30 object-cover object-center"
          />
          <div className="absolute inset-0 -z-20 bg-zinc-950/55" />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(9,9,11,0.96)_0%,rgba(9,9,11,0.82)_38%,rgba(9,9,11,0.28)_72%,rgba(9,9,11,0.5)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />

          <div className="mx-auto grid min-h-[760px] max-w-7xl items-end gap-12 px-6 pt-28 pb-12 lg:min-h-screen lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-14">
            <div className="max-w-xl self-center lg:pb-8">
              <AnimatedGroup variants={transitionVariants}>
                <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                  <LockKeyhole className="size-3 text-orange-400" />
                  {copy.hero.eyebrow}
                </div>
              </AnimatedGroup>

              <TextEffect
                key={`title-${locale}`}
                preset="fade-in-blur"
                speedSegment={0.35}
                as="h1"
                className="max-w-2xl font-heading text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl xl:text-[4.2rem]"
              >
                {copy.hero.title}
              </TextEffect>

              <TextEffect
                key={`description-${locale}`}
                per="line"
                preset="fade-in-blur"
                speedSegment={0.4}
                delay={0.25}
                as="p"
                className="mt-5 max-w-lg text-sm leading-6 text-pretty text-white/68 sm:text-base"
              >
                {copy.hero.description}
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.55,
                      },
                    },
                  },
                  ...transitionVariants,
                }}
                className="mt-7 flex flex-col gap-2.5 sm:flex-row"
              >
                <Link
                  href="/auth/login"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-10 rounded-full bg-orange-600 px-5 text-xs text-white shadow-lg shadow-orange-950/30 hover:bg-orange-500"
                  )}
                >
                  {copy.hero.login}
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/products"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-10 rounded-full border-white/20 bg-white/8 px-5 text-xs text-white hover:bg-white/15 hover:text-white"
                  )}
                >
                  {copy.hero.browse}
                </Link>
              </AnimatedGroup>

              <p className="mt-4 flex items-center gap-2 text-[11px] text-white/50">
                <Check className="size-3 text-emerald-400" />
                {copy.hero.access}
              </p>
            </div>

            <div
              id="products"
              className="relative scroll-mt-28 self-end lg:pb-2"
            >
              <div className="mb-4 max-w-lg lg:ml-auto">
                <p className="mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-orange-400 uppercase">
                  {copy.products.eyebrow}
                </p>
                <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  {copy.products.title}
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-5 text-white/60 sm:text-sm">
                  {copy.products.description}
                </p>
              </div>

              <Carousel
                opts={{ align: "start", loop: true }}
                setApi={setCarouselApi}
                onMouseEnter={() => setIsCarouselPaused(true)}
                onMouseLeave={() => setIsCarouselPaused(false)}
                onFocusCapture={() => setIsCarouselPaused(true)}
                onBlurCapture={() => setIsCarouselPaused(false)}
                className="ml-auto max-w-2xl"
              >
                <CarouselContent className="-ml-3">
                  {copy.products.cards.map((part) => (
                    <CarouselItem
                      key={part.name}
                      className="basis-[78%] pl-3 sm:basis-1/2"
                    >
                      <article className="group relative h-[215px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/20" />
                        <div className="relative">
                          <p className="text-[10px] text-white/50">
                            {part.category}
                          </p>
                          <h3 className="mt-0.5 text-sm font-semibold sm:text-base">
                            {part.name}
                          </h3>
                        </div>

                        <div className="relative mt-1 h-36">
                          <Image
                            src={part.image}
                            alt={part.name}
                            fill
                            sizes="(max-width: 640px) 75vw, 320px"
                            className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </article>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  aria-label={copy.products.previous}
                  className="top-[-2.75rem] right-9 bottom-auto left-auto my-0 size-7 border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                />
                <CarouselNext
                  aria-label={copy.products.next}
                  className="top-[-2.75rem] right-0 bottom-auto left-auto my-0 size-7 border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                />
              </Carousel>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
