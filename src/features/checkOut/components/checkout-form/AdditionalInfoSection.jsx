import CheckoutSection from "./CheckoutSection";
import { CHECKOUT_PLACEHOLDERS } from "../../constants/checkoutForm";
import { useTranslation } from "react-i18next";

export default function AdditionalInfoSection({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <CheckoutSection title={t("checkout.additionalInfo")}>
      <label className="block">
        <span className="type-para mb-1 block text-[#2d2d2d]">
          {t("checkout.additionalInfoLabel")}
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={CHECKOUT_PLACEHOLDERS.additionalInfo}
          className="min-h-[64px] w-full rounded-[10px] border border-[#ded6ce] bg-[#fffdfa] px-3 py-2 text-[13px] text-[#2d2d2d] outline-none transition focus:border-[#cf6e38] focus:ring-2 focus:ring-[#cf6e38]/10 placeholder:text-[#a49b92]"
        />
      </label>
    </CheckoutSection>
  );
}
