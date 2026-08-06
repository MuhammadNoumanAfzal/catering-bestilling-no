import SettingsCheckboxField from "./SettingsCheckboxField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";
import { translateSettings } from "./settingsI18n";

export default function NotificationSettingsSection({ formState, updateField }) {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
  return (
    <SettingsSection
      id="notifications"
      title={st("notificationsTitle")}
      subtitle={st("notificationsSubtitle")}
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="textNotifications"
          label={st("textMessage")}
          checked={formState.textNotifications}
          onChange={(event) =>
            updateField("textNotifications", event.target.checked)
          }
          description={st("textMessageDescription")}
        />
        <SettingsCheckboxField
          id="emailNotifications"
          label={st("email")}
          checked={formState.emailNotifications}
          onChange={(event) =>
            updateField("emailNotifications", event.target.checked)
          }
          description={st("emailDescription")}
        />
        <SettingsCheckboxField
          id="pushNotifications"
          label={st("pushNotification")}
          checked={formState.pushNotifications}
          onChange={(event) =>
            updateField("pushNotifications", event.target.checked)
          }
        />
      </div>

      <div className="mt-4 border-t border-[#ece4dc] pt-3">
        <p className="type-subpara mb-1.5 text-[#8b837b]">{st("orderConfirmation")}</p>
        <SettingsCheckboxField
          id="orderConfirmationPush"
          label={st("pushNotification")}
          checked={formState.orderConfirmationPush}
          onChange={(event) =>
            updateField("orderConfirmationPush", event.target.checked)
          }
        />
      </div>
    </SettingsSection>
  );
}
