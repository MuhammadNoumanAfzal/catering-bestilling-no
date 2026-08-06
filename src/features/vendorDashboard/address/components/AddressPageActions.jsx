import { useTranslation } from "react-i18next";

export default function AddressPageActions({
  isDirty = false,
  isSaving = false,
  onReset,
  onSave,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onReset}
        className="type-h6 w-full cursor-pointer rounded-full border border-[#cfc6bd] bg-white px-5 py-2.5 text-[#1f1f1f] transition hover:bg-[#f8f4ef] sm:w-auto"
      >
        {t("vendorPanel.addressPage.reset")}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className="type-h6 w-full rounded-full bg-[#cf5c2f] px-5 py-2.5 text-white transition hover:bg-[#b95127] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSaving ? t("vendorPanel.addressPage.saving") : t("vendorPanel.addressPage.save")}
      </button>
    </div>
  );
}
