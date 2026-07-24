"use client"

import {
  BellRingIcon,
  BoxesIcon,
  Settings2Icon,
  UserRoundIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type { SettingsCopy } from "./settings-copy"
import type { SettingsSection } from "./settings-types"

const sectionIcons = {
  profile: UserRoundIcon,
  general: Settings2Icon,
  notifications: BellRingIcon,
  inventory: BoxesIcon,
}

function NavigationButton({
  section,
  label,
  active,
  mobile = false,
  onSelect,
}: {
  section: SettingsSection
  label: string
  active: boolean
  mobile?: boolean
  onSelect: (section: SettingsSection) => void
}) {
  const Icon = sectionIcons[section]

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(section)}
      className={cn(
        "flex shrink-0 items-center gap-2.5 border font-medium transition-all focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:outline-none",
        mobile
          ? "h-9 rounded-full px-3.5 text-[11px] whitespace-nowrap"
          : "h-10 w-full rounded-xl px-3 text-[12px]",
        active
          ? "border-foreground bg-foreground text-background shadow-sm"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-foreground hover:shadow-sm"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
    </button>
  )
}

export function MobileSettingsNavigation({
  sections,
  activeSection,
  copy,
  onSelect,
}: {
  sections: readonly SettingsSection[]
  activeSection: SettingsSection
  copy: SettingsCopy
  onSelect: (section: SettingsSection) => void
}) {
  return (
    <div className="border-b border-border/60 p-3 md:hidden" role="tablist">
      <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <NavigationButton
            key={section}
            mobile
            section={section}
            label={copy.tabs[section]}
            active={activeSection === section}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

export function DesktopSettingsNavigation({
  accountSections,
  workspaceSections,
  activeSection,
  copy,
  onSelect,
}: {
  accountSections: readonly SettingsSection[]
  workspaceSections: readonly SettingsSection[]
  activeSection: SettingsSection
  copy: SettingsCopy
  onSelect: (section: SettingsSection) => void
}) {
  return (
    <aside className="hidden border-r border-border/60 bg-muted/25 px-4 py-7 md:block">
      <nav className="sticky top-20" aria-label={copy.groups.account}>
        <NavigationGroup
          label={copy.groups.account}
          sections={accountSections}
          activeSection={activeSection}
          copy={copy}
          onSelect={onSelect}
        />

        {workspaceSections.length > 0 ? (
          <NavigationGroup
            className="mt-7"
            label={copy.groups.workspace}
            sections={workspaceSections}
            activeSection={activeSection}
            copy={copy}
            onSelect={onSelect}
          />
        ) : null}
      </nav>
    </aside>
  )
}

function NavigationGroup({
  className,
  label,
  sections,
  activeSection,
  copy,
  onSelect,
}: {
  className?: string
  label: string
  sections: readonly SettingsSection[]
  activeSection: SettingsSection
  copy: SettingsCopy
  onSelect: (section: SettingsSection) => void
}) {
  return (
    <div className={className}>
      <p className="px-3 pb-2 text-[9px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <div className="space-y-2" role="tablist">
        {sections.map((section) => (
          <NavigationButton
            key={section}
            section={section}
            label={copy.tabs[section]}
            active={activeSection === section}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
