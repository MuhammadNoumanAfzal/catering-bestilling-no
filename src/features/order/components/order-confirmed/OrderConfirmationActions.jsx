import { FiArrowRight, FiEdit3, FiGrid, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderConfirmationActions({
  canModify,
  modifyButtonLabel = "Modify Order",
  modifyDisabled = false,
  onModify,
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      <Link
        to="/"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[#cf6e38] px-6 py-3 text-[15px] font-semibold text-white transition hover:bg-[#bb602d]"
      >
        <FiHome className="text-[16px]" />
        {t("orderConfirmed.backToHome")}
      </Link>

      <Link
        to="/browse/food-type"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
      >
        {t("orderConfirmed.browseMenus")}
        <FiArrowRight className="text-[16px]" />
      </Link>

      <Link
        to="/vendor-dashboard"
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-[#d9cec3] bg-white px-6 py-3 text-[15px] font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38]"
      >
        {t("orderConfirmed.browseDashboard")}
        <FiGrid className="text-[16px]" />
      </Link>

      {canModify ? (
        <button
          type="button"
          onClick={onModify}
          disabled={modifyDisabled}
          className={`inline-flex items-center justify-center gap-2 rounded-[10px] border px-6 py-3 text-[15px] font-semibold transition ${
            modifyDisabled
              ? "cursor-not-allowed border-[#e2d8cf] bg-[#f6f1eb] text-[#9b8f84]"
              : "cursor-pointer border-[#d9cec3] bg-white text-[#2b2622] hover:border-[#cf6e38] hover:text-[#cf6e38]"
          }`}
        >
          {modifyButtonLabel}
          <FiEdit3 className="text-[16px]" />
        </button>
      ) : null}
    </div>
  );
}
