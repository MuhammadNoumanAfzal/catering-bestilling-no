import { FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import AddressCard from "./AddressCard";
import AddressField from "./AddressField";
import AddressTextarea from "./AddressTextarea";

export default function AddressBookSection({
  type,
  title,
  description,
  addresses,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onSetDefault,
  onChangeField,
  extraActionLabel = "",
  onExtraAction = null,
  isExtraActionDisabled = false,
}) {
  const { t } = useTranslation();
  const activeAddress =
    addresses.find((address) => address.id === activeId) ?? addresses[0];
  const typeLabel =
    type === "delivery"
      ? t("vendorPanel.addressPage.addDelivery")
      : t("vendorPanel.addressPage.addInvoice");

  if (!activeAddress) {
    return null;
  }

  return (
    <section className="rounded-[26px] border border-[#dfd6ce] bg-white p-4 shadow-[0_18px_40px_rgba(28,24,20,0.05)] md:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="type-h2 text-[#191919]">{title}</h2>
          <p className="mt-2 type-para text-[#6e655d]">{description}</p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center justify-center gap-1 self-start whitespace-nowrap rounded-full border border-[#efcdb7] bg-[#fff5ee] px-2.5 py-1.5 text-[12px] font-semibold leading-none text-[#c86434] transition hover:bg-[#fff0e6] sm:self-auto"
        >
          <FiPlus className="text-[15px]" />
          {typeLabel}
        </button>

        {onExtraAction ? (
          <button
            type="button"
            onClick={onExtraAction}
            disabled={isExtraActionDisabled}
            className={`inline-flex items-center justify-center gap-1 self-start whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold leading-none transition sm:self-auto ${
              isExtraActionDisabled
                ? "cursor-not-allowed border-[#e4ddd6] bg-[#f6f1eb] text-[#aa9e92]"
                : "border-[#dfd5cb] bg-white text-[#5c5047] hover:bg-[#faf6f2]"
            }`}
          >
            {extraActionLabel}
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isActive={address.id === activeAddress.id}
            onDelete={() => onDelete(address.id)}
            onSelect={() => onSelect(address.id)}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[22px] border border-[#eadfd5] bg-[#fffdfa] p-4 md:p-5">
        <div className="flex flex-col gap-3 border-b border-[#ece2d9] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] font-semibold text-[#1f1f1f]">
              {t("vendorPanel.addressPage.editAddress", {
                label:
                  activeAddress.label ||
                  (type === "delivery"
                    ? t("vendorPanel.addressPage.editFallbackDelivery")
                    : t("vendorPanel.addressPage.editFallbackInvoice")),
              })}
            </p>
            <p className="mt-1 text-[13px] text-[#7b7269]">
              {t("vendorPanel.addressPage.editDescription")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSetDefault(activeAddress.id)}
            className="rounded-full border border-[#dfd5cb] bg-white px-4 py-2 text-sm font-semibold text-[#3a352f] transition hover:bg-[#faf6f2]"
          >
            {activeAddress.isDefault
              ? t("vendorPanel.addressPage.defaultAddress")
              : t("vendorPanel.addressPage.setAsDefault")}
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <AddressField
            label={t("vendorPanel.addressPage.locationName")}
            value={activeAddress.label}
            onChange={(event) =>
              onChangeField(activeAddress.id, "label", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.mainOffice")}
            className="sm:col-span-2 lg:col-span-6"
          />

          <AddressField
            label={t("vendorPanel.addressPage.streetAddress")}
            value={activeAddress.addressLine1}
            onChange={(event) =>
              onChangeField(activeAddress.id, "addressLine1", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.streetPlaceholder")}
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label={t("vendorPanel.addressPage.unitFloor")}
            value={activeAddress.addressLine2}
            onChange={(event) =>
              onChangeField(activeAddress.id, "addressLine2", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.floorPlaceholder")}
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label={t("vendorPanel.addressPage.city")}
            value={activeAddress.city}
            onChange={(event) =>
              onChangeField(activeAddress.id, "city", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.cityPlaceholder")}
            className="lg:col-span-2"
          />

          <AddressField
            label={t("vendorPanel.addressPage.state")}
            value={activeAddress.state}
            onChange={(event) =>
              onChangeField(activeAddress.id, "state", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.statePlaceholder")}
            className="lg:col-span-2"
          />

          <AddressField
            label={t("vendorPanel.addressPage.postalCode")}
            value={activeAddress.postalCode}
            onChange={(event) =>
              onChangeField(activeAddress.id, "postalCode", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.postalCodePlaceholder")}
            className="lg:col-span-2"
          />

          <AddressField
            label={t("vendorPanel.addressPage.phoneNumber")}
            value={activeAddress.phoneNumber}
            onChange={(event) =>
              onChangeField(activeAddress.id, "phoneNumber", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.phonePlaceholder")}
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressField
            label={t("vendorPanel.addressPage.receivingName")}
            value={activeAddress.contactName}
            onChange={(event) =>
              onChangeField(activeAddress.id, "contactName", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.receivingPlaceholder")}
            className="sm:col-span-1 lg:col-span-3"
          />

          <AddressTextarea
            label={t("vendorPanel.addressPage.instructions")}
            value={activeAddress.instructions}
            onChange={(event) =>
              onChangeField(activeAddress.id, "instructions", event.target.value)
            }
            placeholder={t("vendorPanel.addressPage.instructionsPlaceholder")}
            className="sm:col-span-2 lg:col-span-4"
          />
        </div>
      </div>
    </section>
  );
}
