import { FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CheckoutHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="border-b border-[#eee7e0] bg-white/95">
      <div className="mx-auto flex h-18 max-w-9xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#faf7f3] text-[#5f554e] transition hover:bg-[#fff0e8] hover:text-[#c85f33]"
            aria-label={t("checkout.goBack")}
          >
            <FiArrowLeft className="text-[18px]" />
          </button>

          <Link to="/" className="inline-flex cursor-pointer">
            <img
              src="/home/logo (2).png"
              alt="GoCatering"
              className="h-18 w-auto object-contain"
            />
          </Link>
        </div>

        <p className="hidden text-[14px] font-semibold tracking-[-0.02em] text-[#2b2b2b] sm:block">
          {t("checkout.title")}
        </p>
      </div>
    </header>
  );
}
