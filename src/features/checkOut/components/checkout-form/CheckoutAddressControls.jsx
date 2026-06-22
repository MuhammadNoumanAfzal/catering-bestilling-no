export default function CheckoutAddressControls({
  title,
  selectedAddressId,
  savedAddresses,
  onSelectAddress,
  isEditing,
  onToggleEditing,
}) {
  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <select
          value={selectedAddressId}
          onChange={(event) => onSelectAddress(event.target.value)}
          className="type-subpara min-w-[170px] rounded-full border border-[#d8d0c7] bg-[#fcfaf8] px-3 py-2 text-[#37322f] outline-none"
        >
          {savedAddresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.label || "Saved address"}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onToggleEditing}
          className="rounded-full border border-[#efcdb7] bg-[#fff5ee] px-3.5 py-2 text-sm font-semibold text-[#c86434] transition hover:bg-[#fff0e6]"
        >
          {isEditing ? "Hide editor" : title}
        </button>
      </div>
      <p className="text-[12px] text-[#8b8177]">
        Auto-filled from saved addresses, but you can still customize it here.
      </p>
    </div>
  );
}
