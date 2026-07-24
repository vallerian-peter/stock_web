"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { GeneralSettingsPanel } from "./general-settings-panel"
import { InventorySettingsPanel } from "./inventory-settings-panel"
import { NotificationsSettingsPanel } from "./notifications-settings-panel"
import { ProfileSettings } from "./profile-settings"
import { SettingsPanelFallback } from "./settings-controls"
import {
  DesktopSettingsNavigation,
  MobileSettingsNavigation,
} from "./settings-navigation"
import {
  accountSettingsSections,
  type SettingsSection,
  workspaceSettingsSections,
} from "./settings-types"
import { useDashboardSettings } from "./use-dashboard-settings"

export function DashboardSettingsPage() {
  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("profile")
  const { copy, savePreferences, saveWorkspace, saving, settings } =
    useDashboardSettings()

  const availableWorkspaceSections = settings?.canManageWorkspace
    ? workspaceSettingsSections
    : []
  const visibleSections = [
    ...accountSettingsSections,
    ...availableWorkspaceSections,
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80 shadow-sm backdrop-blur-sm">
      <MobileSettingsNavigation
        sections={visibleSections}
        activeSection={activeSection}
        copy={copy}
        onSelect={setActiveSection}
      />

      <div className="md:grid md:min-h-[640px] md:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)]">
        <DesktopSettingsNavigation
          accountSections={accountSettingsSections}
          workspaceSections={availableWorkspaceSections}
          activeSection={activeSection}
          copy={copy}
          onSelect={setActiveSection}
        />

        <main
          className="min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-7"
          role="tabpanel"
          aria-label={copy.tabs[activeSection]}
        >
          <div className="mb-6 flex h-8 items-center justify-between border-b border-border/60 pb-4">
            <h2 className="font-heading text-lg font-semibold tracking-tight">
              {copy.tabs[activeSection]}
            </h2>
            {!saving && settings && activeSection !== "profile" ? (
              <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                <CheckIcon className="size-3" />
                {copy.saved}
              </span>
            ) : null}
          </div>

          {activeSection === "profile" ? (
            <ProfileSettings copy={copy.profile} />
          ) : null}

          {!settings && activeSection !== "profile" ? (
            <SettingsPanelFallback />
          ) : null}

          {settings && activeSection === "general" ? (
            <GeneralSettingsPanel
              preferences={settings.preferences}
              copy={copy.general}
              saving={saving}
              onSave={savePreferences}
            />
          ) : null}

          {settings && activeSection === "notifications" ? (
            <NotificationsSettingsPanel
              preferences={settings.preferences}
              copy={copy.notifications}
              saving={saving}
              onSave={savePreferences}
            />
          ) : null}

          {settings && activeSection === "inventory" ? (
            <InventorySettingsPanel
              settings={settings.workspace}
              copy={copy.inventory}
              saving={saving}
              onSave={saveWorkspace}
            />
          ) : null}
        </main>
      </div>
    </div>
  )
}
