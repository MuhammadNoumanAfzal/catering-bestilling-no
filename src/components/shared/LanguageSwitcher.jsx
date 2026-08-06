import { useTranslation } from "react-i18next";
import { FiChevronDown, FiGlobe } from "react-icons/fi";
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
      className={`inline-flex items-center gap-3 text-sm font-medium text-[#4d433c] ${className}`.trim()}
    >
      <span className="shrink-0 rounded-full bg-[rgba(255,250,245,0.88)] px-3 py-1.5 text-[15px] font-semibold text-[#4a3528] shadow-[0_8px_20px_rgba(39,24,16,0.08)] backdrop-blur-sm">
        {t("language.label")}
      </span>
      <span className="relative inline-flex min-w-[138px] items-center">
        <span className="pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff3ea] text-[#c85f33] shadow-[inset_0_0_0_1px_rgba(200,95,51,0.10)]">
          <FiGlobe className="text-[15px]" />
        </span>
        <select
          value={selectedValue}
          onChange={(event) => {
            void handleChange(event.target.value);
          }}
          className="h-12 w-full cursor-pointer appearance-none rounded-full border border-[#e8d7c9] bg-[linear-gradient(180deg,#ffffff_0%,#fff9f4_100%)] pl-14 pr-11 text-sm font-semibold text-[#2f2f2f] outline-none shadow-[0_8px_22px_rgba(39,24,16,0.06)] transition duration-200 hover:border-[#d9b79c] hover:shadow-[0_10px_24px_rgba(39,24,16,0.10)] focus:border-[#c85f33] focus:shadow-[0_0_0_4px_rgba(200,95,51,0.12)]"
          aria-label={t("language.label")}
        >
          <option value="en">{t("language.english")}</option>
          <option value="no">{t("language.norwegian")}</option>
        </select>
        <span className="pointer-events-none absolute right-3.5 text-[#6f6258]">
          <FiChevronDown className="text-[16px]" />
        </span>
      </span>
    </label>
  );
}
