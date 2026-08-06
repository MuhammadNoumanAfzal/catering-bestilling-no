import SettingsCheckboxField from "./SettingsCheckboxField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";

export default function NotificationSettingsSection({ formState, updateField }) {
  const { t } = useTranslation();
  return (
    <SettingsSection
      id="notifications"
      title={t("vendorPanel.settingsPage.notificationsTitle")}
      subtitle={t("vendorPanel.settingsPage.notificationsSubtitle")}
    >
      <div className="space-y-1.5">
        <SettingsCheckboxField
          id="textNotifications"
          label={t("vendorPanel.settingsPage.textMessage")}
          checked={formState.textNotifications}
          onChange={(event) =>
            updateField("textNotifications", event.target.checked)
          }
          description={t("vendorPanel.settingsPage.textMessageDescription")}
        />
        <SettingsCheckboxField
          id="emailNotifications"
          label={t("vendorPanel.settingsPage.email")}
          checked={formState.emailNotifications}
          onChange={(event) =>
            updateField("emailNotifications", event.target.checked)
          }
          description={t("vendorPanel.settingsPage.emailDescription")}
        />
        <SettingsCheckboxField
          id="pushNotifications"
          label={t("vendorPanel.settingsPage.pushNotification")}
          checked={formState.pushNotifications}
          onChange={(event) =>
            updateField("pushNotifications", event.target.checked)
          }
        />
      </div>

      <div className="mt-4 border-t border-[#ece4dc] pt-3">
        <p className="type-subpara mb-1.5 text-[#8b837b]">{t("vendorPanel.settingsPage.orderConfirmation")}</p>
        <SettingsCheckboxField
          id="orderConfirmationPush"
          label={t("vendorPanel.settingsPage.pushNotification")}
          checked={formState.orderConfirmationPush}
          onChange={(event) =>
            updateField("orderConfirmationPush", event.target.checked)
          }
        />
      </div>
    </SettingsSection>
  );
}
