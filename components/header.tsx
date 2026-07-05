"use client"

import { lazy, Suspense } from "react"

import { HeroHeaderClient } from "./hero-header-client"

const HeaderAuthAction = lazy(() =>
  import("./header-auth-action").then((module) => ({
    default: module.HeaderAuthAction,
  }))
)

function HeaderAuthFallback() {
  return (
    <div className="h-4 w-5 animate-pulse rounded-sm bg-slate-300 px-5 py-3 dark:bg-slate-600" />
  )
}

export function HeroHeader() {
  return (
    <HeroHeaderClient
      authAction={
        <Suspense fallback={<HeaderAuthFallback />}>
          <HeaderAuthAction />
        </Suspense>
      }
    />
  )
}
