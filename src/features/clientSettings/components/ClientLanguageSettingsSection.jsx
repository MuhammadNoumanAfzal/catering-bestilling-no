import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/shared/LanguageSwitcher";
import SettingsSection from "../../vendorDashboard/components/settings/SettingsSection";

export default function ClientLanguageSettingsSection({ onChangeLanguage }) {
  const { t } = useTranslation();

  return (
    <SettingsSection
      id="language"
      title={t("settings.languageTitle")}
      subtitle={t("settings.languageSubtitle")}
    >
      <div className="flex flex-col gap-3 rounded-[18px] border border-[#eadfd5] bg-[#fffaf6] p-4">
        <LanguageSwitcher onChange={onChangeLanguage} />
      </div>
    </SettingsSection>
  );
}
