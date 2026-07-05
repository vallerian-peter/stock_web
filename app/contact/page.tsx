import type { Metadata } from "next"

import ContactPage from "@/components/contact-page"

export const metadata: Metadata = {
  title: "Contact | Valler Parts",
  description: "Contact Valler Parts for company and inventory-system support.",
}

export default function Page() {
  return <ContactPage />
}
