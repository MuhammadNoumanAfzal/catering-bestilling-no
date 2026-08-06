import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import SettingsActions from "../../vendorDashboard/components/settings/SettingsActions";
import ClientLanguageSettingsSection from "../components/ClientLanguageSettingsSection";
import ClientNotificationSettingsSection from "../components/ClientNotificationSettingsSection";
import { useClientSettingsPage } from "../hooks/useClientSettingsPage";

export default function ClientSettingsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const {
    formState,
    isDirty,
    isLoading,
    isSaving,
    handleReset,
    handleSave,
    updateField,
    handleLanguageChange,
  } = useClientSettingsPage();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#fffaf6]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="bg-[#fffaf6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#eadfd5] bg-white p-5 shadow-[0_18px_40px_rgba(55,34,19,0.06)] sm:p-6 lg:p-8">
        <div className="border-b border-[#ece4dc] pb-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b37a59]">
            {t("settings.accountBadge")}
          </p>
          <h1 className="mt-2 text-[28px] font-semibold text-[#1c1713]">
            {t("settings.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[#6b5d53]">
            {t("settings.description")}
          </p>
        </div>

        <div className="mt-6 space-y-6">
          <ClientLanguageSettingsSection
            onChangeLanguage={handleLanguageChange}
          />
          <ClientNotificationSettingsSection
            formState={formState}
            updateField={updateField}
          />
          <SettingsActions
            isDirty={isDirty}
            isSaving={isSaving}
            onReset={handleReset}
            onSave={handleSave}
            resetLabel={t("settings.reset")}
            saveHeading={t("settings.saveHeading")}
            saveLabel={t("settings.save")}
            savingLabel={t("settings.saving")}
          />
        </div>
      </div>
    </section>
  );
}
