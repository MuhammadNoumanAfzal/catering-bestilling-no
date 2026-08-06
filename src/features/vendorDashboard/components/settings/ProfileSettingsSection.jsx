import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";
import { useTranslation } from "react-i18next";
import { translateSettings } from "./settingsI18n";

export default function ProfileSettingsSection({ formState, updateField }) {
  const { t, i18n } = useTranslation();
  const st = (key, options) => translateSettings(t, i18n, key, options);
  return (
    <SettingsSection id="profile" title={st("profile")}>
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="firstName"
          label={st("firstName")}
          value={formState.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="lastName"
          label={st("lastName")}
          value={formState.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="primaryEmail"
          label={st("primaryEmail")}
          value={formState.primaryEmail}
          onChange={(event) => updateField("primaryEmail", event.target.value)}
          placeholder=""
          type="email"
          disabled
        />
        <SettingsField
          id="secondaryEmail"
          label={st("secondaryEmail")}
          value={formState.secondaryEmail}
          onChange={(event) => updateField("secondaryEmail", event.target.value)}
          placeholder=""
          type="email"
        />
        <SettingsField
          id="mobilePhone"
          label={st("mobilePhone")}
          value={formState.mobilePhone}
          onChange={(event) => updateField("mobilePhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="workPhone"
          label={st("workPhone")}
          value={formState.workPhone}
          onChange={(event) => updateField("workPhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="postCode"
          label={st("postalCode")}
          value={formState.postCode}
          onChange={(event) => updateField("postCode", event.target.value)}
          placeholder=""
          readOnly
        />
        <SettingsField
          id="company"
          label={st("company")}
          value={formState.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="jobTitle"
          label={st("jobTitle")}
          value={formState.jobTitle}
          onChange={(event) => updateField("jobTitle", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="industry"
          label={st("industry")}
          value={formState.industry}
          onChange={(event) => updateField("industry", event.target.value)}
          placeholder=""
        />
      </div>
    </SettingsSection>
  );
}
