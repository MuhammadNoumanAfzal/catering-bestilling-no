import { FiMapPin, FiStar, FiTrash2 } from "react-icons/fi";

export default function AddressCard({
  address,
  isActive,
  onDelete,
  onSelect,
}) {
  return (
    <div
      className={[
        "rounded-[18px] border p-4 text-left transition",
        isActive
          ? "border-[#cf6e38] bg-[#fff4ed] shadow-[0_14px_30px_rgba(207,110,56,0.12)]"
          : "border-[#e5ddd5] bg-white hover:border-[#d7c6b7]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0e5] text-[#cf6e38]">
            <FiMapPin className="text-[16px]" />
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#1f1f1f]">
              {address.label || "Untitled address"}
            </p>
            <p className="mt-1 text-[13px] leading-5 text-[#6a625b]">
              {[address.addressLine1, address.city, address.postalCode]
                .filter(Boolean)
                .join(", ") || "No address added yet"}
            </p>
          </div>
        </button>

        <div className="flex shrink-0 items-start gap-2">
          {address.isDefault ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#cf6e38] px-2.5 py-1 text-[11px] font-semibold text-white">
              <FiStar className="text-[11px]" />
              Default
            </span>
          ) : null}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e7d9ce] bg-white text-[#9b8170] transition hover:border-[#d76c4a] hover:text-[#d76c4a]"
            aria-label={`Delete ${address.label || "address"}`}
          >
            <FiTrash2 className="text-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
