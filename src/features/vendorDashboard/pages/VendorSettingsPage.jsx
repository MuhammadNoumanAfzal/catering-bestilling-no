import AccountSafetySection from "../components/settings/AccountSafetySection";
import { useTranslation } from "react-i18next";
import { translateSettings } from "../components/settings/settingsI18n";
import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import PasswordSettingsSection from "../components/settings/PasswordSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import { useVendorSettingsPage } from "../settings/hooks/useVendorSettingsPage";

export default function VendorSettingsPage() {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
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
      <section>
        <h1 className="type-h2 text-[#191919]">{st("title")}</h1>
      </section>

      <div className="space-y-6">
        {loadWarning ? (
          <div className="rounded-[18px] border border-[#f1cfb7] bg-[#fff7f1] px-4 py-3 text-sm text-[#8a5335]">
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
        <AccountSafetySection email={formState.primaryEmail} />
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
