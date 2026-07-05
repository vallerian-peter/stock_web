import type { Metadata } from "next"
import { Geist_Mono, Inter, Roboto } from "next/font/google"

import "./globals.css"
import { ConfirmAlertDialogProvider } from "@/components/confirm-alert-dialog-provider"
import { LandingLocaleProvider } from "@/components/landing-locale-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Valler Parts | Car Parts Inventory Management",
  description:
    "Private car-parts inventory management for the Valler Parts owner and authorized workers.",
}

const robotoHeading = Roboto({
  subsets: ["latin"],
  variable: "--font-heading",
})

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "scroll-smooth antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        robotoHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <LandingLocaleProvider>
            <ConfirmAlertDialogProvider>
              {children}
              <Toaster />
            </ConfirmAlertDialogProvider>
          </LandingLocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
