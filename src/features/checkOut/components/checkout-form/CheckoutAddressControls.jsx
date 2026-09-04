import { useTranslation } from "react-i18next";

export default function CheckoutAddressControls({
  title,
  selectedAddressId,
  savedAddresses,
  onSelectAddress,
  isEditing,
  onToggleEditing,
}) {
  const { t } = useTranslation();
  const hasSavedAddresses = Array.isArray(savedAddresses) && savedAddresses.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
        {hasSavedAddresses ? (
          <select
            value={selectedAddressId}
            onChange={(event) => onSelectAddress(event.target.value)}
            className="min-w-[150px] rounded-full border border-[#ded6ce] bg-[#fffdfa] px-3 py-1.5 text-[12px] text-[#37322f] outline-none"
          >
            {savedAddresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.label || t("checkout.savedAddress")}
              </option>
            ))}
          </select>
        ) : null}

        <button
          type="button"
          onClick={onToggleEditing}
          className="rounded-full border border-[#efcdb7] bg-[#fff5ee] px-3 py-1.5 text-[12px] font-semibold text-[#c86434] transition hover:bg-[#fff0e6]"
        >
          {isEditing ? t("checkout.hideEditor") : title}
        </button>
    </div>
  );
}
