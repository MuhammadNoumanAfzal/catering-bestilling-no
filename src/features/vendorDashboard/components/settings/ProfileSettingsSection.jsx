import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";

export default function ProfileSettingsSection({ formState, updateField }) {
  const { t } = useTranslation();
  return (
    <SettingsSection id="profile" title={t("vendorPanel.settingsPage.profile")}>
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="firstName"
          label={t("vendorPanel.settingsPage.firstName")}
          value={formState.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="lastName"
          label={t("vendorPanel.settingsPage.lastName")}
          value={formState.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="primaryEmail"
          label={t("vendorPanel.settingsPage.primaryEmail")}
          value={formState.primaryEmail}
          onChange={(event) => updateField("primaryEmail", event.target.value)}
          placeholder=""
          type="email"
          disabled
        />
        <SettingsField
          id="secondaryEmail"
          label={t("vendorPanel.settingsPage.secondaryEmail")}
          value={formState.secondaryEmail}
          onChange={(event) => updateField("secondaryEmail", event.target.value)}
          placeholder=""
          type="email"
        />
        <SettingsField
          id="mobilePhone"
          label={t("vendorPanel.settingsPage.mobilePhone")}
          value={formState.mobilePhone}
          onChange={(event) => updateField("mobilePhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="workPhone"
          label={t("vendorPanel.settingsPage.workPhone")}
          value={formState.workPhone}
          onChange={(event) => updateField("workPhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="postCode"
          label={t("vendorPanel.settingsPage.postalCode")}
          value={formState.postCode}
          onChange={(event) => updateField("postCode", event.target.value)}
          placeholder=""
          readOnly
        />
        <SettingsField
          id="company"
          label={t("vendorPanel.settingsPage.company")}
          value={formState.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="jobTitle"
          label={t("vendorPanel.settingsPage.jobTitle")}
          value={formState.jobTitle}
          onChange={(event) => updateField("jobTitle", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="industry"
          label={t("vendorPanel.settingsPage.industry")}
          value={formState.industry}
          onChange={(event) => updateField("industry", event.target.value)}
          placeholder=""
        />
      </div>
    </SettingsSection>
  );
}
