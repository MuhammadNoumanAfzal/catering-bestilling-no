import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";
import { translateSettings } from "./settingsI18n";

export default function PasswordSettingsSection({
  formState,
  onPasswordFocus,
  updateField,
}) {
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
          name="vendor-password-change-old"
          label={st("oldPassword")}
          value={formState.oldPassword}
          onChange={(event) => updateField("oldPassword", event.target.value)}
          onFocus={onPasswordFocus}
          placeholder=""
          type="password"
          autoComplete="new-password"
        />
        <SettingsField
          id="confirmOldPassword"
          name="vendor-password-change-old-confirmation"
          label={st("confirmPassword")}
          value={formState.confirmOldPassword}
          onChange={(event) =>
            updateField("confirmOldPassword", event.target.value)
          }
          onFocus={onPasswordFocus}
          placeholder=""
          type="password"
          autoComplete="new-password"
        />
        <SettingsField
          id="newPassword"
          name="vendor-password-change-new"
          label={st("newPassword")}
          value={formState.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          onFocus={onPasswordFocus}
          placeholder=""
          type="password"
          autoComplete="new-password"
        />
        <SettingsField
          id="confirmNewPassword"
          name="vendor-password-change-new-confirmation"
          label={st("confirmPassword")}
          value={formState.confirmNewPassword}
          onChange={(event) =>
            updateField("confirmNewPassword", event.target.value)
          }
          onFocus={onPasswordFocus}
          placeholder=""
          type="password"
          autoComplete="new-password"
        />
      </div>
    </SettingsSection>
  );
}
