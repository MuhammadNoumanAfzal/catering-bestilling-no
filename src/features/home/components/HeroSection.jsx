import { FiMapPin, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import HomeNavbar from "./HomeNavbar";

export default function HeroSection({
  deliveryAddress,
  onDeliveryAddressChange,
  onBrowseVendors,
  postalCode,
  onPostalCodeChange,
  hasValidPostalCode,
  onSearch,
  searchValidationMessage,
}) {
  const { t } = useTranslation();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.();
    }
  };

  return (
    <section className="bg-[#fffaf5]">
      <div className="mx-auto max-w-[1380px]">
        <HomeNavbar />

        <div className="px-4 pb-6 sm:px-6 sm:pb-8 lg:px-8 lg:pb-10">
          <div className="grid items-center gap-6 overflow-hidden bg-transparent py-2 sm:gap-8 sm:py-4 lg:grid-cols-[0.95fr_1.05fr] lg:gap-6 lg:py-6">
            <div className="max-w-[680px] pl-0 sm:pl-4 lg:pl-6">
              <h1 className="max-w-[12ch] text-[28px] font-black leading-[0.98] tracking-[-0.05em] text-[#17110d] sm:max-w-none sm:text-[46px] sm:leading-[1.02] lg:text-[56px]">
                {t("home.heroTitleLineOne")}
                <br />
                {t("home.heroTitleLineTwo")}
              </h1>

              <div className="mt-5 max-w-[620px] sm:mt-7">
                <div className="grid gap-2.5 sm:gap-3 md:grid-cols-[1.2fr_0.75fr_0.68fr]">
                  <div className="flex h-12 items-center rounded-xl border border-[#e7d8cd] bg-white px-3.5 shadow-[0_10px_24px_rgba(97,63,39,0.06)] sm:h-14 sm:px-4">
                    <FiMapPin className="shrink-0 text-sm text-[#8b7b70]" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(event) =>
                        onDeliveryAddressChange?.(event.target.value)
                      }
                      onKeyDown={handleKeyDown}
                      placeholder={t("home.deliveryAddressPlaceholder")}
                      className="ml-2.5 w-full bg-transparent text-[14px] text-[#514741] outline-none placeholder:text-[#b6a79c] sm:ml-3 sm:text-[15px]"
                    />
                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={postalCode}
                    onChange={(event) =>
                      onPostalCodeChange?.(
                        event.target.value.replace(/\D/g, "").slice(0, 5),
                      )
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={t("home.postalCodePlaceholder")}
                    className="h-12 rounded-xl border border-[#e7d8cd] bg-white px-3.5 text-[14px] text-[#514741] outline-none placeholder:text-[#b6a79c] shadow-[0_10px_24px_rgba(97,63,39,0.06)] transition focus:border-[#e98c65] sm:h-14 sm:px-4 sm:text-[15px]"
                  />

                  <button
                    type="button"
                    onClick={onSearch}
                    className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#d46f38] px-5 text-[14px] font-bold text-white shadow-[0_14px_30px_rgba(212,111,56,0.22)] transition hover:bg-[#bf5f2d] sm:h-14 sm:px-6 sm:text-[15px]"
                  >
                    <FiSearch className="text-base" />
                    {t("home.search")}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onBrowseVendors}
                  className="mt-3 inline-flex min-h-[50px] w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#ead7ca] bg-white px-4 text-left text-[#241815] shadow-[0_12px_28px_rgba(97,63,39,0.08)] transition hover:border-[#cf6e38] sm:mt-4 sm:h-[54px] sm:w-auto sm:px-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d46f38] text-white">
                    <FiSearch className="text-sm" />
                  </span>
                  <span className="flex min-w-0 flex-col items-start leading-none">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c46a35]">
                      {t("home.explore")}
                    </span>
                    <span className="text-[14px] font-semibold text-[#241815] sm:text-[15px]">
                      {t("home.browseAllVendors")}
                    </span>
                  </span>
                </button>

                {searchValidationMessage ||
                (postalCode && !hasValidPostalCode) ? (
                  <p className="mt-3 text-sm text-[#5f5a55]">
                    {searchValidationMessage ? (
                      <span className="font-medium text-[#b6542c]">
                        {searchValidationMessage}
                      </span>
                    ) : (
                      t("home.postalCodeHint")
                    )}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center pt-1 sm:pt-2 lg:justify-end">
              <img
                src="/home/image.png"
                alt="Catering hero"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-auto w-full max-w-[320px] object-contain sm:max-w-[520px] lg:max-w-[760px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
