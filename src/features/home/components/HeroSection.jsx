import { FiArrowRight, FiMapPin, FiSearch } from "react-icons/fi";
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
    <section className="relative overflow-hidden bg-[#fbf8f5]">
      <img
        src="/home/heroBg.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <HomeNavbar />

        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-10 px-5 py-10 md:px-6 lg:grid-cols-2 lg:gap-14 lg:px-10 lg:py-14">
          <div className="max-w-[620px]">
            <h1 className="max-w-[560px] text-[40px] font-extrabold leading-[1.04] tracking-[-0.03em] text-black sm:text-[54px] lg:text-[64px]">
              {t("home.heroTitleLineOne")}
              <br />
              {t("home.heroTitleLineTwo")}
            </h1>

            <p className="type-h5 mt-6 max-w-[540px] text-gray-700">
              {t("home.heroSubtitle")}
            </p>

            <div className="mt-8 max-w-[600px]">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-12 py-2 flex-1 items-center rounded-xl border border-gray-300 bg-white px-4 transition focus-within:border-[#e98c65]">
                  <FiMapPin className="shrink-0 text-sm text-gray-500" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(event) =>
                      onDeliveryAddressChange?.(event.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder={t("home.deliveryAddressPlaceholder")}
                    className="type-para ml-3 w-full bg-transparent text-gray-700 outline-none placeholder:text-gray-400"
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
                  className="type-para h-12 rounded-xl border border-gray-300 bg-white px-4 text-gray-700 outline-none placeholder:text-gray-400 transition focus-within:border-[#e98c65] sm:w-[180px]"
                />
              </div>

              <button
                type="button"
                onClick={onSearch}
                className="type-h6 mt-3 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c85f33] px-6 text-white transition hover:bg-[#b9542b]"
              >
                <FiSearch className="text-base" />
                {t("home.search")}
              </button>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onBrowseVendors}
                  className="group type-h6 inline-flex h-[52px] cursor-pointer items-center justify-center gap-3 self-start rounded-2xl border border-[#e8d4c8] bg-white px-5 text-[#241815] shadow-[0_14px_34px_rgba(115,63,37,0.12)] transition duration-200 hover:-translate-y-[2px] hover:border-[#cf6e38] hover:shadow-[0_20px_44px_rgba(201,95,51,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cf6e38]/30"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d97845_0%,#bf5c31_100%)] text-white shadow-[0_8px_16px_rgba(191,92,49,0.28)] transition duration-200 group-hover:scale-105">
                    <FiSearch className="text-sm" />
                  </span>
                  <span className="flex flex-col items-start leading-none">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c46a35]">
                      {t("home.explore")}
                    </span>
                    <span className="text-[15px] font-semibold text-[#241815]">
                      {t("home.browseAllVendors")}
                    </span>
                  </span>
                  <FiArrowRight className="ml-1 text-base text-[#c46a35] transition duration-200 group-hover:translate-x-1" />
                </button>
              </div>
              {searchValidationMessage || (postalCode && !hasValidPostalCode) ? (
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

          <div className="flex w-full items-center justify-center">
            <div className="relative w-full">
              <img
                src="/home/home-hero.webp"
                alt="Home hero"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="h-[320px] w-full object-contain sm:h-[420px] lg:h-[560px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
