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
          className="type-subpara min-h-[76px] w-full rounded-[2px] border border-[#d9d1c7] bg-white px-2 py-2 text-[#2d2d2d] outline-none placeholder:text-[#a49b92]"
        />
      </label>
    </CheckoutSection>
  );
}
