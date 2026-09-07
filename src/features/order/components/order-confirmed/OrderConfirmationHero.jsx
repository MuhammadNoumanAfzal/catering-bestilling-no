import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationHero() {
  const { t } = useTranslation();
  return (
    <>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7ef]">
        <div className="flex items-center justify-center text-[#27834a]">
          <FaCheck className="text-[22px]" />
        </div>
      </div>

      <h1 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight text-[#201b17] sm:text-[28px]">
        {t("orderConfirmed.placedSuccessfully")}
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-[13px] leading-5 text-[#5f5a55]">
        {t("orderConfirmed.heroDescription")}
      </p>
    </>
  );
}
