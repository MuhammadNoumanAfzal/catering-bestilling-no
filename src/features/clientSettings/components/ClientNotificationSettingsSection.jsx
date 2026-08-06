import SettingsCheckboxField from "../../vendorDashboard/components/settings/SettingsCheckboxField";
import SettingsSection from "../../vendorDashboard/components/settings/SettingsSection";
import { useTranslation } from "react-i18next";

export default function ClientNotificationSettingsSection({
  formState,
  updateField,
}) {
  const { t } = useTranslation();

  return (
    <SettingsSection
      id="notifications"
      title={t("settings.notificationTitle")}
      subtitle={t("settings.notificationSubtitle")}
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="emailEnabled"
          label={t("settings.email")}
          checked={formState.emailEnabled}
          onChange={(event) => updateField("emailEnabled", event.target.checked)}
          description={t("settings.emailDescription")}
        />
        <SettingsCheckboxField
          id="smsEnabled"
          label={t("settings.sms")}
          checked={formState.smsEnabled}
          onChange={(event) => updateField("smsEnabled", event.target.checked)}
          description={t("settings.smsDescription")}
        />
        <SettingsCheckboxField
          id="pushEnabled"
          label={t("settings.push")}
          checked={formState.pushEnabled}
          onChange={(event) => updateField("pushEnabled", event.target.checked)}
          description={t("settings.pushDescription")}
        />
      </div>
    </SettingsSection>
  );
}
