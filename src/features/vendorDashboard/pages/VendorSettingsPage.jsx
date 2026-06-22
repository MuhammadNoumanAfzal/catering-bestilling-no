import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import { useVendorSettingsPage } from "../settings/hooks/useVendorSettingsPage";

export default function VendorSettingsPage() {
  const {
    formState,
    handleReset,
    handleSave,
    isDirty,
    isLoading,
    isSaving,
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
      <section>
        <h1 className="type-h2 text-[#191919]">Settings</h1>
      </section>

      <div className="space-y-6">
        <ProfileSettingsSection formState={formState} updateField={updateField} />
        <NotificationSettingsSection
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
