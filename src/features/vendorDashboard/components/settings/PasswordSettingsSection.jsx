import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";

export default function PasswordSettingsSection({ formState, updateField }) {
  const { t } = useTranslation();
  return (
    <SettingsSection
      id="password"
      title={t("vendorPanel.settingsPage.passwordTitle")}
      subtitle={t("vendorPanel.settingsPage.passwordSubtitle")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="oldPassword"
          label={t("vendorPanel.settingsPage.oldPassword")}
          value={formState.oldPassword}
          onChange={(event) => updateField("oldPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmOldPassword"
          label={t("vendorPanel.settingsPage.confirmPassword")}
          value={formState.confirmOldPassword}
          onChange={(event) =>
            updateField("confirmOldPassword", event.target.value)
          }
          placeholder=""
          type="password"
        />
        <SettingsField
          id="newPassword"
          label={t("vendorPanel.settingsPage.newPassword")}
          value={formState.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmNewPassword"
          label={t("vendorPanel.settingsPage.confirmPassword")}
          value={formState.confirmNewPassword}
          onChange={(event) =>
            updateField("confirmNewPassword", event.target.value)
          }
          placeholder=""
          type="password"
        />
      </div>
    </SettingsSection>
  );
}
