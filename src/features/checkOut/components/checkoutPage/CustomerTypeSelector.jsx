import { FiBriefcase, FiUser } from "react-icons/fi";
import { MODE_LABELS, VALID_TYPES } from "./checkoutPage.constants";

export default function CustomerTypeSelector({
  normalizedType,
  onTypeChange,
}) {
  return (
    <section className="rounded-[10px] border border-[#e6dfd7] bg-white p-3 shadow-[0_2px_10px_rgba(26,18,10,0.08)]">
      <div className="flex items-center gap-2 text-[#222222]">
        <FiUser className="type-h3 text-[#d46331]" />
        <p className="type-h3 font-semibold leading-none">Customer type</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 type-h5">
        {VALID_TYPES.map((type) => {
          const isActive = normalizedType === type;
          const Icon = type === "corporate" ? FiBriefcase : FiUser;

          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-[4px] border text-[14px] font-medium transition ${
                isActive
                  ? "border-[#f08a61] bg-[#fff3ee] text-[#d46331]"
                  : "border-[#c9c4bd] bg-white text-[#6b655f]"
              }`}
            >
              <Icon className="type-h3" />
              <span>{MODE_LABELS[type]}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
