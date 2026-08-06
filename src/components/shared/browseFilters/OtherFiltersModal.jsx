import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  distanceOptions,
  orderMinimumOptions,
} from "../../../features/browse/data/browseData";
import {
  createDefaultOtherFilters,
  FILTER_DEFAULTS,
  translateBrowseOptionLabel,
} from "./browseFilterConfig";
import InlineSelectDropdown from "./InlineSelectDropdown";

export default function OtherFiltersModal({
  otherFilters,
  setOtherFilters,
  onClose,
}) {
  const { t } = useTranslation();
  const [openInlineDropdown, setOpenInlineDropdown] = useState(null);

  const updateOtherFilter = (key, value) => {
    setOtherFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 px-4 py-6">
      <div className="flex max-h-full w-full max-w-[440px] flex-col overflow-hidden rounded-[12px] border border-[#d9d9d9] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
        <div className="hide-scrollbar overflow-y-auto px-3 pt-3 sm:px-4 sm:pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <h1 className="type-h3 mb-3 text-black">{t("browse.filters.other")}</h1>
          <div className="space-y-3 pb-4 pr-2">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={otherFilters.individualPackaging}
                onChange={(event) =>
                  updateOtherFilter("individualPackaging", event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#CF3A00]"
              />
                <span>
                  <span className="type-para block text-black">
                    {t("browse.otherFilters.individualPackaging")}
                  </span>
                  <span className="type-subpara text-[#8a8a8a]">
                    {t("browse.otherFilters.individualPackagingDescription")}
                  </span>
                </span>
              </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={otherFilters.newlyAdded}
                onChange={(event) =>
                  updateOtherFilter("newlyAdded", event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#CF3A00]"
              />
              <span>
                <span className="type-para block text-black">{t("browse.otherFilters.new")}</span>
                <span className="type-subpara text-[#8a8a8a]">
                  {t("browse.otherFilters.newDescription")}
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={otherFilters.smallBusiness}
                onChange={(event) =>
                  updateOtherFilter("smallBusiness", event.target.checked)
                }
                className="mt-1 h-4 w-4 accent-[#CF3A00]"
              />
              <span className="type-para text-black">{t("browse.otherFilters.smallBusiness")}</span>
            </label>

            <div>
              <p className="type-para mb-1 text-black">{t("browse.otherFilters.budgetPerPerson")}</p>
              <input
                type="text"
                value={otherFilters.budgetPerPerson}
                onChange={(event) =>
                  updateOtherFilter("budgetPerPerson", event.target.value)
                }
                placeholder={t("browse.otherFilters.currencyPlaceholder")}
                className={`type-subpara w-full rounded-[2px] border px-3 py-2 outline-none transition ${
                  otherFilters.budgetPerPerson
                    ? "border-[#CF3A00] text-[#CF3A00]"
                    : "border-[#cfcfcf] text-black"
                }`}
              />
            </div>

            <div className="pt-6 sm:pt-10">
              <h4 className="type-h4 mb-3 text-black">{t("browse.otherFilters.deliveryFilters")}</h4>

              <div className="space-y-3">
                <InlineSelectDropdown
                  label={t("browse.otherFilters.orderMinimum")}
                  value={translateBrowseOptionLabel(t, otherFilters.orderMinimum)}
                  options={orderMinimumOptions}
                  isOpen={openInlineDropdown === "orderMinimum"}
                  onToggle={() =>
                    setOpenInlineDropdown((current) =>
                      current === "orderMinimum" ? null : "orderMinimum",
                    )
                  }
                  onSelect={(option) => {
                    updateOtherFilter(
                      "orderMinimum",
                      otherFilters.orderMinimum === option ? FILTER_DEFAULTS.orderMinimum : option,
                    );
                    setOpenInlineDropdown(null);
                  }}
                  menuPosition="bottom"
                />

                <InlineSelectDropdown
                  label={t("browse.otherFilters.distance")}
                  value={translateBrowseOptionLabel(t, otherFilters.distance)}
                  options={distanceOptions}
                  isOpen={openInlineDropdown === "distance"}
                  onToggle={() =>
                    setOpenInlineDropdown((current) =>
                      current === "distance" ? null : "distance",
                    )
                  }
                  onSelect={(option) => {
                    updateOtherFilter(
                      "distance",
                      otherFilters.distance === option ? FILTER_DEFAULTS.distance : option,
                    );
                    setOpenInlineDropdown(null);
                  }}
                  menuPosition="top"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#ece7e2] bg-white px-3 py-3 sm:px-4">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setOtherFilters(createDefaultOtherFilters());
                onClose();
              }}
              className="type-para cursor-pointer rounded-[6px] border border-[#bcbcbc] px-2 py-1 text-black"
            >
              {t("browse.clearFilter")}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="type-para cursor-pointer rounded-[6px] bg-[#CF3A00] px-2 py-1 text-white"
            >
              {t("browse.applyFilter")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
