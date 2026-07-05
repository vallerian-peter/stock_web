import type { AppLocale } from "@/lib/types"

export const APP_LOCALE_STORAGE_KEY = "valler-locale"
export const APP_LOCALE_CHANGE_EVENT = "valler-locale-change"

export function normalizeAppLocale(locale: string | null | undefined): AppLocale {
  return locale?.toLowerCase().startsWith("sw") ? "sw" : "en"
}

export function getServerAppLocale(): AppLocale {
  return "en"
}

export function getStoredAppLocale(): AppLocale {
  if (typeof window === "undefined") {
    return getServerAppLocale()
  }

  return normalizeAppLocale(window.localStorage.getItem(APP_LOCALE_STORAGE_KEY))
}

export function setStoredAppLocale(locale: AppLocale) {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale)
  window.dispatchEvent(new Event(APP_LOCALE_CHANGE_EVENT))
}
