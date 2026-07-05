import type { Metadata } from "next"

import ProductsPage from "@/components/products-page"

export const metadata: Metadata = {
  title: "Parts Catalogue | Valler Parts",
  description: "Browse the car-part categories managed by Valler Parts.",
}

export default function Page() {
  return <ProductsPage />
}
