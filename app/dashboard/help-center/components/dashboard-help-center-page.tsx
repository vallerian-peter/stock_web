"use client"

import * as React from "react"
import { CircleHelpIcon } from "lucide-react"

import { useLandingLocale } from "@/components/landing-locale-provider"
import { Badge } from "@/components/ui/badge"
import type { SupportRequestType } from "@/lib/dtos/support_dtos"

import { HelpFaqSection } from "./help-faq-section"
import { helpCenterCopy } from "./help-center-copy"
import { SupportChannelSelector } from "./support-channel-selector"
import { SupportRequestForm } from "./support-request-form"
import { SupportRequestHistory } from "./support-request-history"
import { useSupportRequests } from "./use-support-requests"

export function DashboardHelpCenterPage() {
  const [activeType, setActiveType] = React.useState<SupportRequestType>("help")
  const { locale } = useLandingLocale()
  const copy = helpCenterCopy[locale]
  const { requests, loading, loadError, reload, submit } = useSupportRequests()

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Badge
          variant="outline"
          className="h-6 gap-1.5 bg-muted/60 px-2.5 text-[10px] text-muted-foreground"
        >
          <CircleHelpIcon />
          {copy.prompt}
        </Badge>
        <SupportChannelSelector
          activeType={activeType}
          copy={copy.channels}
          onSelect={setActiveType}
        />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <SupportRequestForm
          key={activeType}
          activeType={activeType}
          copy={copy.form}
          onSubmitted={submit}
        />
        <SupportRequestHistory
          copy={copy.history}
          requests={requests}
          loading={loading}
          loadError={loadError}
          locale={locale}
          onRetry={() => void reload()}
        />
      </div>

      <HelpFaqSection copy={copy.faq} />
    </div>
  )
}
