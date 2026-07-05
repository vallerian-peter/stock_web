import type { LandingLocale } from "@/lib/landing-content"

export const categoryDialogCopy = {
  en: {
    addTitle: "Add category",
    addDescription: "Create a product or parts category for cleaner organization.",
    editTitle: "Edit category",
    editDescription: "Update the category label used across product records.",
    viewTitle: "Category details",
    viewDescription: "Review this category before making changes.",
    name: "Category name",
    namePlaceholder: "Enter category name",
    createdAt: "Created at",
    cancel: "Cancel",
    create: "Create category",
    save: "Save changes",
    close: "Close",
    createSuccess: (name: string) => `${name} was created.`,
    updateSuccess: (name: string) => `${name} was updated.`,
    deleteTitle: "Delete this category?",
    deleteDescription: (name: string) =>
      `You are about to remove ${name}. This action cannot be undone.`,
    bulkDeleteTitle: "Delete selected categories?",
    bulkDeleteDescription: (count: number) =>
      `You are about to remove ${count} selected categories. This action cannot be undone.`,
    confirmDelete: "Delete",
    deleteSuccess: (name: string) => `${name} was deleted.`,
    bulkDeleteSuccess: (count: number) =>
      `${count} selected categories were deleted.`,
    validation: {
      nameRequired: "Enter the category name.",
      nameLength: "Category name must be at least 2 characters.",
    },
  },
  sw: {
    addTitle: "Ongeza kundi",
    addDescription: "Unda kundi la bidhaa au spea kwa mpangilio mzuri zaidi.",
    editTitle: "Hariri kundi",
    editDescription: "Sasisha jina la kundi linalotumika kwenye bidhaa.",
    viewTitle: "Taarifa za kundi",
    viewDescription: "Kagua kundi hili kabla ya kufanya mabadiliko.",
    name: "Jina la kundi",
    namePlaceholder: "Weka jina la kundi",
    createdAt: "Tarehe ya kuundwa",
    cancel: "Ghairi",
    create: "Ongeza kundi",
    save: "Hifadhi mabadiliko",
    close: "Funga",
    createSuccess: (name: string) => `${name} limeongezwa.`,
    updateSuccess: (name: string) => `${name} limesasishwa.`,
    deleteTitle: "Futa kundi hili?",
    deleteDescription: (name: string) =>
      `Unakaribia kuondoa ${name}. Hatua hii haiwezi kutenduliwa.`,
    bulkDeleteTitle: "Futa makundi yaliyochaguliwa?",
    bulkDeleteDescription: (count: number) =>
      `Unakaribia kuondoa makundi ${count} yaliyochaguliwa. Hatua hii haiwezi kutenduliwa.`,
    confirmDelete: "Futa",
    deleteSuccess: (name: string) => `${name} limefutwa.`,
    bulkDeleteSuccess: (count: number) =>
      `Makundi ${count} yaliyochaguliwa yamefutwa.`,
    validation: {
      nameRequired: "Weka jina la kundi.",
      nameLength: "Jina la kundi liwe na angalau herufi 2.",
    },
  },
} as const satisfies Record<LandingLocale, unknown>

export type CategoryDialogCopy = (typeof categoryDialogCopy)[LandingLocale]
