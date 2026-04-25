import CheckoutSection from "./CheckoutSection";
import { PLACEHOLDERS } from "./checkoutPage.constants";

export default function AdditionalInfoSection({ value, onChange }) {
  return (
    <CheckoutSection title="Additional Info">
      <label className="block">
        <span className="type-para mb-1 block text-[#2d2d2d]">
          Order notes / Allergens &amp; Dietary Requirements
        </span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={PLACEHOLDERS.additionalInfo}
          className="type-subpara min-h-[76px] w-full rounded-[2px] border border-[#d9d1c7] bg-white px-2 py-2 text-[#2d2d2d] outline-none placeholder:text-[#a49b92]"
        />
      </label>
    </CheckoutSection>
  );
}
