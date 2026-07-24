"use client"

import { useLandingLocale } from "@/components/landing-locale-provider"

const uiCopy = {
  en: {
    loading: "Loading",
    close: "Close",
    previousSlide: "Previous slide",
    nextSlide: "Next slide",
    sidebar: "Sidebar",
    sidebarDescription: "Displays the mobile sidebar.",
    toggleSidebar: "Toggle sidebar",
    hidePassword: "Hide password",
    showPassword: "Show password",
    rulesToFollow: "Rules to follow",
    capsLockOn: "Caps Lock is on.",
    pagination: "Pagination",
    previous: "Previous",
    next: "Next",
    previousPage: "Go to previous page",
    nextPage: "Go to next page",
    morePages: "More pages",
    breadcrumb: "Breadcrumb",
    more: "More",
    invalidDate: "Enter a valid date in dd/mm/yyyy format.",
    invalidDateTime: "Enter a valid date and time in dd/mm/yyyy HH:mm format.",
  },
  sw: {
    loading: "Inapakia",
    close: "Funga",
    previousSlide: "Slaidi iliyopita",
    nextSlide: "Slaidi inayofuata",
    sidebar: "Menyu ya pembeni",
    sidebarDescription: "Inaonyesha menyu ya pembeni kwenye simu.",
    toggleSidebar: "Fungua au funga menyu ya pembeni",
    hidePassword: "Ficha nenosiri",
    showPassword: "Onyesha nenosiri",
    rulesToFollow: "Masharti ya kufuata",
    capsLockOn: "Caps Lock imewashwa.",
    pagination: "Kurasa",
    previous: "Nyuma",
    next: "Mbele",
    previousPage: "Nenda ukurasa uliopita",
    nextPage: "Nenda ukurasa unaofuata",
    morePages: "Kurasa zaidi",
    breadcrumb: "Mfuatano wa kurasa",
    more: "Zaidi",
    invalidDate: "Weka tarehe sahihi kwa muundo wa dd/mm/yyyy.",
    invalidDateTime: "Weka tarehe na muda sahihi kwa muundo wa dd/mm/yyyy HH:mm.",
  },
} as const

export function useUiCopy() {
  const { locale } = useLandingLocale()
  return uiCopy[locale]
}
