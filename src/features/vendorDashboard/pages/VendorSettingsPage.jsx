import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NotificationSettingsSection from "../components/settings/NotificationSettingsSection";
import PasswordSettingsSection from "../components/settings/PasswordSettingsSection";
import ProfileSettingsSection from "../components/settings/ProfileSettingsSection";
import SettingsActions from "../components/settings/SettingsActions";
import { vendorSettingsInitialState } from "../data/vendorDashboardData";

export default function VendorSettingsPage() {
  const location = useLocation();
  const [formState, setFormState] = useState(vendorSettingsInitialState);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash]);

  function updateField(key, value) {
    setFormState((current) => ({ ...current, [key]: value }));
  }

  function handleReset() {
    setFormState(vendorSettingsInitialState);
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Setting</h1>
      </section>

      <div className="space-y-6">
        <ProfileSettingsSection formState={formState} updateField={updateField} />
        <PasswordSettingsSection formState={formState} updateField={updateField} />
        <NotificationSettingsSection
          formState={formState}
          updateField={updateField}
        />
        <SettingsActions onReset={handleReset} />
      </div>
    </div>
  );
}
