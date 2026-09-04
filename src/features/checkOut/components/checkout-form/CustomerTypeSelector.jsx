import { FiBriefcase, FiUser } from "react-icons/fi";
import {
  CHECKOUT_MODE_LABELS,
  VALID_CHECKOUT_TYPES,
} from "../../constants/checkoutForm";
import { useTranslation } from "react-i18next";

export default function CustomerTypeSelector({
  normalizedType,
  onTypeChange,
}) {
  const { t } = useTranslation();
  return (
    <section className="border-b border-[#eee7e0] pb-4">
      <div className="flex items-center gap-2 text-[#222222]">
        <FiUser className="type-h3 text-[#d46331]" />
        <p className="type-h3 font-semibold leading-none">{t("checkout.customerType")}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {VALID_CHECKOUT_TYPES.map((type) => {
          const isActive = normalizedType === type;
          const Icon = type === "corporate" ? FiBriefcase : FiUser;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[10px] border text-[13px] font-medium transition ${
                isActive
                  ? "border-[#f08a61] bg-[#fff3ee] text-[#d46331]"
                  : "border-[#c9c4bd] bg-white text-[#6b655f]"
              }`}
            >
              <Icon className="type-h3" />
              <span>{t(`checkout.mode.${type}`, CHECKOUT_MODE_LABELS[type])}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
