import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationHero() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff1ea]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#cf6e38] text-white shadow-[0_10px_24px_rgba(207,110,56,0.28)]">
          <FaCheck className="text-[26px]" />
        </div>
      </div>

      <p className="mt-6 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#b77754]">
        {t("orderConfirmed.placedSuccessfully")}
      </p>
      <h1 className="mt-3 text-[34px] font-semibold leading-tight text-[#201b17] sm:text-[42px]">
        {t("orderConfirmed.heroTitle")}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-7 text-[#5f5a55]">
        {t("orderConfirmed.heroDescription")}
      </p>
    </>
  );
}
