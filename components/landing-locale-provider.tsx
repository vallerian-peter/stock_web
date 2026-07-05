"use client"

import * as React from "react"

import type { LandingLocale } from "@/lib/landing-content"
import {
  APP_LOCALE_CHANGE_EVENT,
  APP_LOCALE_STORAGE_KEY,
  getServerAppLocale,
  getStoredAppLocale,
  setStoredAppLocale,
} from "@/lib/locale"

type LandingLocaleContextValue = {
  locale: LandingLocale
  setLocale: (locale: LandingLocale) => void
}

const LandingLocaleContext = React.createContext<
  LandingLocaleContextValue | undefined
>(undefined)

function subscribeToLocale(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === APP_LOCALE_STORAGE_KEY) onStoreChange()
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener(APP_LOCALE_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(APP_LOCALE_CHANGE_EVENT, onStoreChange)
  }
}

export function LandingLocaleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = React.useSyncExternalStore(
    subscribeToLocale,
    getStoredAppLocale,
    getServerAppLocale
  )

  function setLocale(nextLocale: LandingLocale) {
    setStoredAppLocale(nextLocale)
  }

  React.useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LandingLocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LandingLocaleContext.Provider>
  )
}

export function useLandingLocale() {
  const context = React.useContext(LandingLocaleContext)

  if (!context) {
    throw new Error(
      "useLandingLocale must be used within LandingLocaleProvider"
    )
  }

  return context
}
