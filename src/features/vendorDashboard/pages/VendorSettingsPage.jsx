import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import PasswordSettingsSection from "../components/settings/PasswordSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import DashboardPageHero from "../components/DashboardPageHero";
import { useVendorSettingsPage } from "../settings/hooks/useVendorSettingsPage";

export default function VendorSettingsPage() {
  const {
    formState,
    handleReset,
    handleSave,
    isDirty,
    isLoading,
    isSaving,
    loadWarning,
    updateField,
  } = useVendorSettingsPage();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHero
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account profile, notifications, and password from one polished control panel."
        stats={[
          {
            label: "Profile",
            value: "Ready",
            note: "Business identity and contact details.",
          },
          {
            label: "Alerts",
            value: "Live",
            note: "Notification preferences can be updated here.",
          },
          {
            label: "Security",
            value: "Secure",
            note: "Password controls are available below.",
          },
          {
            label: "Changes",
            value: isDirty ? "Unsaved" : "Saved",
            note: isDirty
              ? "There are local changes waiting to be saved."
              : "All visible settings are up to date.",
          },
        ]}
      />

      <div className="space-y-6">
        {loadWarning ? (
          <div className="rounded-[22px] border border-[#f1cfb7] bg-[#fff7f1] px-4 py-4 text-sm text-[#8a5335] shadow-[0_12px_24px_rgba(32,20,12,0.05)]">
            {loadWarning}
          </div>
        ) : null}
        <ProfileSettingsSection formState={formState} updateField={updateField} />
        <NotificationSettingsSection
          formState={formState}
          updateField={updateField}
        />
        <PasswordSettingsSection
          formState={formState}
          updateField={updateField}
        />
        <SettingsActions
          isDirty={isDirty}
          isSaving={isSaving}
          onReset={handleReset}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
