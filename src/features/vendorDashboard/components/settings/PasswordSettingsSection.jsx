import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";
import { translateSettings } from "./settingsI18n";

export default function PasswordSettingsSection({ formState, updateField }) {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
  return (
    <SettingsSection
      id="password"
      title={st("passwordTitle")}
      subtitle={st("passwordSubtitle")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="oldPassword"
          label={st("oldPassword")}
          value={formState.oldPassword}
          onChange={(event) => updateField("oldPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmOldPassword"
          label={st("confirmPassword")}
          value={formState.confirmOldPassword}
          onChange={(event) =>
            updateField("confirmOldPassword", event.target.value)
          }
          placeholder=""
          type="password"
        />
        <SettingsField
          id="newPassword"
          label={st("newPassword")}
          value={formState.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmNewPassword"
          label={st("confirmPassword")}
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
