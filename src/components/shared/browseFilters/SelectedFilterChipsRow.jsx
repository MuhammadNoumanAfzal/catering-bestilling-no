import { useTranslation } from "react-i18next";
import SelectedFilterChip from "./SelectedFilterChip";

export default function SelectedFilterChipsRow({ chips, onClearAll }) {
  const { t } = useTranslation();
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-[22px] border border-[#efd8c8] bg-[#fffaf6] px-3 py-3 shadow-[0_10px_24px_rgba(207,110,56,0.08)]">
      {chips.map((chip) => (
        <SelectedFilterChip
          key={chip.id}
          label={chip.label}
          onRemove={chip.onRemove}
          tone={chip.tone}
        />
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="type-subpara inline-flex h-9 cursor-pointer items-center rounded-full border border-[#e5c8b4] bg-white px-4 text-[#7a4e36] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
      >
        {t("browse.clearAllFilters")}
      </button>
    </div>
  );
}
