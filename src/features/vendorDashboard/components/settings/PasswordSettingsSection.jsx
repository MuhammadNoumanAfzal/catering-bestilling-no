import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";

export default function PasswordSettingsSection({ formState, updateField }) {
  return (
    <SettingsSection id="password" title="Password" subtitle="change password">
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="oldPassword"
          label="Old Password *"
          value={formState.oldPassword}
          onChange={(event) => updateField("oldPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmOldPassword"
          label="Confirm Password *"
          value={formState.confirmOldPassword}
          onChange={(event) =>
            updateField("confirmOldPassword", event.target.value)
          }
          placeholder=""
          type="password"
        />
        <SettingsField
          id="newPassword"
          label="New Password *"
          value={formState.newPassword}
          onChange={(event) => updateField("newPassword", event.target.value)}
          placeholder=""
          type="password"
        />
        <SettingsField
          id="confirmNewPassword"
          label="Confirm Password *"
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
