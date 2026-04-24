import SettingsField from "./SettingsField";
import SettingsSection from "./SettingsSection";

export default function ProfileSettingsSection({ formState, updateField }) {
  return (
    <SettingsSection id="profile" title="Profile">
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsField
          id="firstName"
          label="First name *"
          value={formState.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="lastName"
          label="Last name *"
          value={formState.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="primaryEmail"
          label="Primary email *"
          value={formState.primaryEmail}
          onChange={(event) => updateField("primaryEmail", event.target.value)}
          placeholder=""
          type="email"
        />
        <SettingsField
          id="secondaryEmail"
          label="Secondary email"
          value={formState.secondaryEmail}
          onChange={(event) => updateField("secondaryEmail", event.target.value)}
          placeholder=""
          type="email"
        />
        <SettingsField
          id="mobilePhone"
          label="Mobile phone *"
          value={formState.mobilePhone}
          onChange={(event) => updateField("mobilePhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="workPhone"
          label="Work phone"
          value={formState.workPhone}
          onChange={(event) => updateField("workPhone", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="company"
          label="Company"
          value={formState.company}
          onChange={(event) => updateField("company", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="jobTitle"
          label="Job title"
          value={formState.jobTitle}
          onChange={(event) => updateField("jobTitle", event.target.value)}
          placeholder=""
        />
        <SettingsField
          id="industry"
          label="Industry or usage"
          value={formState.industry}
          onChange={(event) => updateField("industry", event.target.value)}
          placeholder=""
        />
      </div>
    </SettingsSection>
  );
}
