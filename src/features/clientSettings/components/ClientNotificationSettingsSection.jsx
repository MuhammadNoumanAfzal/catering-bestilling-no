import SettingsCheckboxField from "../../vendorDashboard/components/settings/SettingsCheckboxField";
import SettingsSection from "../../vendorDashboard/components/settings/SettingsSection";

export default function ClientNotificationSettingsSection({
  formState,
  updateField,
}) {
  return (
    <SettingsSection
      id="notifications"
      title="Notification Preferences"
      subtitle="Choose how you want to receive account and order notifications."
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="emailEnabled"
          label="Email"
          checked={formState.emailEnabled}
          onChange={(event) => updateField("emailEnabled", event.target.checked)}
          description="Receive notifications in your email inbox."
        />
        <SettingsCheckboxField
          id="smsEnabled"
          label="Text message"
          checked={formState.smsEnabled}
          onChange={(event) => updateField("smsEnabled", event.target.checked)}
          description="Receive important order updates by SMS."
        />
        <SettingsCheckboxField
          id="pushEnabled"
          label="Push notification"
          checked={formState.pushEnabled}
          onChange={(event) => updateField("pushEnabled", event.target.checked)}
          description="Receive push notifications on supported devices."
        />
      </div>
    </SettingsSection>
  );
}
