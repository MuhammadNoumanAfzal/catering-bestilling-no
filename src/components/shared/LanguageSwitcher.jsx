import { useTranslation } from "react-i18next";
import { writeSavedLanguage } from "../../i18n/languagePreferences";

export default function LanguageSwitcher({
  className = "",
  onChange,
  value,
}) {
  const { i18n, t } = useTranslation();
  const selectedValue = value ?? i18n.language;

  const handleChange = async (nextLanguage) => {
    if (onChange) {
      await onChange(nextLanguage);
      return;
    }

    await i18n.changeLanguage(nextLanguage);
    writeSavedLanguage(nextLanguage);
  };

  return (
    <label
      className={`inline-flex items-center gap-2 text-sm font-medium text-[#4d433c] ${className}`.trim()}
    >
      <span>{t("language.label")}</span>
      <select
        value={selectedValue}
        onChange={(event) => {
          void handleChange(event.target.value);
        }}
        className="rounded-full border border-[#e1d4c7] bg-white px-3 py-2 text-sm text-[#2f2f2f] outline-none transition focus:border-[#c85f33]"
        aria-label={t("language.label")}
      >
        <option value="en">{t("language.english")}</option>
        <option value="no">{t("language.norwegian")}</option>
      </select>
    </label>
  );
}
