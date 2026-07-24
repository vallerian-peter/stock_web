import { DashboardSectionPage } from "@/components/dashboard/dashboard-section-page"
import { DashboardSettingsPage } from "@/app/dashboard/settings/components/dashboard-settings-page"

export default function AccountPage() {
  return (
    <DashboardSectionPage>
      <DashboardSettingsPage />
    </DashboardSectionPage>
  )
}
