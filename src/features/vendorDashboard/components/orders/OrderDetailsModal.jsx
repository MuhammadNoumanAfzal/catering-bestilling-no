import { FiArrowRight, FiStar, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { getOrderStatusClasses } from "./orderUtils";

const PENDING_VENDOR_ADJUSTMENT_STATUSES = new Set([
  "PENDING",
  "PENDING_CUSTOMER_APPROVAL",
]);

function getOrderDetailItems(order) {
  return Array.isArray(order?.items) ? order.items : [];
}

function getOrderMeta(order) {
  return {
    image: order?.image ?? "/home/hero1.webp",
    invoiceId: order?.invoiceId ?? "",
    orderedDate: order?.orderedDate ?? "",
    eventDate: order?.deliveredDate ?? order?.date ?? "",
    eventTime: order?.eventTime ?? "",
    location: order?.location ?? "",
  };
}

function getModifiedItems(order) {
  return Array.isArray(order?.modifiedItems) ? order.modifiedItems : [];
}

function splitItemDetails(details) {
  const entries = Array.isArray(details) ? details : [];

  return entries.reduce(
    (accumulator, entry) => {
      const value = `${entry ?? ""}`.trim();

      if (!value) {
        return accumulator;
      }

      if (value.startsWith("Note:")) {
        accumulator.notes.push(value.replace(/^Note:\s*/i, "").trim());
        return accumulator;
      }

      if (value.startsWith("Add-on:")) {
        accumulator.addOns.push(value.replace(/^Add-on:\s*/i, "").trim());
        return accumulator;
      }

      if (value.startsWith("Included:")) {
        accumulator.included.push(value.replace(/^Included:\s*/i, "").trim());
        return accumulator;
      }

      if (value.includes(":")) {
        accumulator.options.push(value);
        return accumulator;
      }

      accumulator.description.push(value);
      return accumulator;
    },
    {
      notes: [],
      description: [],
      options: [],
      addOns: [],
      included: [],
    },
  );
}

function hasOpenPendingVendorAdjustment(adjustment) {
  const normalizedStatus = `${adjustment?.status ?? ""}`.trim().toUpperCase();
  return PENDING_VENDOR_ADJUSTMENT_STATUSES.has(normalizedStatus);
}

function splitVendorAdjustmentNote(value) {
  const requestedDishPrefix = "Requested included-dish changes:";
  const suggestedMenuPrefix = "Suggested menu additions:";
  const suggestedIncludedDishPrefix = "Suggested included dishes from other menus:";
  const customAlternativePrefix = "Custom alternative suggestions:";
  const requestedDishChanges = [];
  const suggestedMenuItems = [];
  const suggestedIncludedDishes = [];
  const customAlternativeSuggestions = [];
  const noteLines = [];

  `${value ?? ""}`
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith(requestedDishPrefix)) {
        requestedDishChanges.push(
          ...line
            .slice(requestedDishPrefix.length)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        );
        return;
      }

      if (line.startsWith(suggestedMenuPrefix)) {
        suggestedMenuItems.push(
          ...line
            .slice(suggestedMenuPrefix.length)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        );
        return;
      }

      if (line.startsWith(suggestedIncludedDishPrefix)) {
        suggestedIncludedDishes.push(
          ...line
            .slice(suggestedIncludedDishPrefix.length)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        );
        return;
      }

      if (line.startsWith(customAlternativePrefix)) {
        customAlternativeSuggestions.push(
          ...line
            .slice(customAlternativePrefix.length)
            .split(";")
            .map((item) => item.trim())
            .filter(Boolean),
        );
        return;
      }

      noteLines.push(line);
    });

  return {
    requestedDishChanges,
    suggestedMenuItems,
    suggestedIncludedDishes,
    customAlternativeSuggestions,
    vendorNote: noteLines.join("\n"),
  };
}

function adjustmentChangesPrice(adjustment, currentGuestCount) {
  if (!adjustment) {
    return false;
  }

  const hasItemChanges =
    (Array.isArray(adjustment.removedItemsJson) && adjustment.removedItemsJson.length > 0) ||
    (Array.isArray(adjustment.addedItemsJson) && adjustment.addedItemsJson.length > 0);
  const proposedGuestCount = Number(adjustment.proposedGuestCount || 0);

  return hasItemChanges || (proposedGuestCount > 0 && proposedGuestCount !== Number(currentGuestCount || 0));
}

function ItemDetailGroup({ label, items, accent = "default" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const accentClasses =
    accent === "highlight"
      ? "bg-[#fff6ee] text-[#b86433]"
      : accent === "soft"
        ? "bg-[#f8f5f1] text-[#6f655d]"
        : "bg-[#fcf7f2] text-[#5f554c]";

  return (
    <div className={`rounded-[16px] px-4 py-3 ${accentClasses}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">{label}</p>
      <div className="mt-2 space-y-2 text-sm leading-6">
        {items.map((item) => (
          <p key={`${label}-${item}`}>{item}</p>
        ))}
      </div>
    </div>
  );
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onModify,
  onApproveVendorAdjustment,
  onRejectVendorAdjustment,
  isResolvingVendorAdjustment = false,
  isLoading = false,
  error = "",
}) {
  const { t } = useTranslation();
  if (!isOpen || !order) {
    return null;
  }

  const items = getOrderDetailItems(order);
  const meta = getOrderMeta(order);
  const modifiedItems = getModifiedItems(order);
  const pendingVendorAdjustment = order?.pendingVendorAdjustment || null;
  const latestVendorAdjustment = order?.latestVendorAdjustment || null;
  const hasPendingVendorAdjustment = hasOpenPendingVendorAdjustment(pendingVendorAdjustment);
  const visibleVendorAdjustment = hasPendingVendorAdjustment
    ? pendingVendorAdjustment
    : latestVendorAdjustment;
  const adjustmentNote = splitVendorAdjustmentNote(visibleVendorAdjustment?.vendorNote);
  const includedDishReplacements = Array.isArray(visibleVendorAdjustment?.includedDishReplacements)
    ? visibleVendorAdjustment.includedDishReplacements
    : [];
  const shouldShowPriceChange = adjustmentChangesPrice(visibleVendorAdjustment, order?.person);
  const proposedAddress = [
    visibleVendorAdjustment?.proposedAddressLine1,
    visibleVendorAdjustment?.proposedAddressLine2,
    visibleVendorAdjustment?.proposedCity,
    visibleVendorAdjustment?.proposedPostalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(31,22,15,0.45)] px-4 py-6 backdrop-blur-[6px]">
      <div className="relative max-h-[92vh] w-full max-w-[760px] overflow-hidden rounded-[30px] border border-white/60 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] shadow-[0_30px_80px_rgba(24,18,14,0.24)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,#ffd8bf_0%,rgba(255,216,191,0)_72%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 cursor-pointer rounded-full border border-white/70 bg-white/90 p-2.5 text-[#1f1f1f] shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition hover:bg-white"
          aria-label={t("vendorPanel.orderDetails.closeAria")}
        >
          <FiX className="text-[18px]" />
        </button>

        <div className="hide-scrollbar max-h-[92vh] overflow-y-auto">
          <div className="relative border-b border-[#efe6de] px-6 py-6 text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#c67a4d]">
              {t("vendorPanel.orderDetails.overview")}
            </p>
            <h2 className="mt-2 type-h2 text-[#1f1f1f]">{t("vendorPanel.orderDetails.title")}</h2>
          </div>

          <div className="px-6 pt-5">
            <div className="overflow-hidden rounded-[24px] border border-[#eee5dc] shadow-[0_18px_36px_rgba(40,26,15,0.10)]">
              <img
                src={meta.image}
                alt={order.eventName}
                className="h-[250px] w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 px-6 py-6">
            {isLoading ? (
              <div className="rounded-[22px] border border-[#efe5db] bg-[#fcf8f4] p-6 text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
                <p className="mt-4 text-sm text-[#6f665d]">
                  {t("vendorPanel.orderDetails.loading")}
                </p>
              </div>
            ) : null}

            {error && !isLoading ? (
              <div className="rounded-[22px] border border-[#f1c8bb] bg-[#fff5f1] p-5 text-center">
                <p className="text-sm font-semibold text-[#7a3f2e]">
                  {t("vendorPanel.orderDetails.loadErrorTitle")}
                </p>
                <p className="mt-2 text-sm text-[#8a5642]">{error}</p>
              </div>
            ) : null}

            <div className="rounded-[22px] border border-[#efe5db] bg-[#fcf8f4] p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#5d554d]">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)] ${getOrderStatusClasses(order.status)}`}
                >
                  {order.status}
                </span>
                {order.isModified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2e9] px-3 py-1 text-xs font-semibold text-[#cf6e38] shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)]">
                    <FiStar className="fill-current text-[12px]" />
                    {t("vendorPanel.orderDetails.changeRequested")}
                  </span>
                ) : null}
                <p>
                  {t("vendorPanel.orderDetails.vendor")}:{" "}
                  <span className="font-semibold text-[#1f1f1f]">{order.vendor}</span>
                </p>
                <p>
                  {t("vendorPanel.orderDetails.orderId")}:{" "}
                  <span className="font-semibold text-[#1f1f1f]">{order.id}</span>
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.event")}
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.eventName}</p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.guests")}
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.person}</p>
                </div>
                <div className="rounded-[18px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.total")}
                  </p>
                  <p className="mt-1 type-h4 text-[#1f1f1f]">{order.total}</p>
                </div>
              </div>
            </div>

            <section>
              <div className="flex items-center justify-between gap-3">
                <h3 className="type-h3 text-[#1f1f1f]">{t("vendorPanel.orderDetails.items")}</h3>
                <span className="rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                  {t("vendorPanel.orderDetails.itemCount", { count: items.length })}
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const detailGroups = splitItemDetails(item.details);

                    return (
                      <div
                        key={item.id || `${item.name}-${index}`}
                        className="rounded-[22px] border border-[#efe5db] bg-white p-4 shadow-[0_10px_24px_rgba(31,22,15,0.05)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="type-h4 text-[#1f1f1f]">
                              {item.quantity} {item.name}
                            </p>
                          </div>
                          <p className="type-h4 shrink-0 text-[#1f1f1f]">{item.price}</p>
                        </div>

                        <div className="mt-4 space-y-3 text-sm leading-6 text-[#72695f]">
                          <ItemDetailGroup
                            label={t("vendorPanel.orderDetails.description")}
                            items={detailGroups.description}
                            accent="soft"
                          />
                          <ItemDetailGroup
                            label={t("vendorPanel.orderDetails.vendorNote")}
                            items={detailGroups.notes}
                            accent="highlight"
                          />
                          <ItemDetailGroup
                            label={t("vendorPanel.orderDetails.selectedOptions")}
                            items={detailGroups.options}
                          />
                          <ItemDetailGroup
                            label={t("vendorPanel.orderDetails.addOns")}
                            items={detailGroups.addOns}
                            accent="highlight"
                          />
                          <ItemDetailGroup
                            label={t("vendorPanel.orderDetails.includedItems")}
                            items={detailGroups.included}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-[22px] border border-dashed border-[#ddd4cb] bg-white p-6 text-center text-sm text-[#776d64]">
                    {t("vendorPanel.orderDetails.noItems")}
                  </div>
                )}
              </div>
            </section>

            {modifiedItems.length > 0 ? (
              <section className="rounded-[24px] border border-[#efe5db] bg-[linear-gradient(180deg,#fff9f5_0%,#ffffff_100%)] p-5 shadow-[0_12px_24px_rgba(31,22,15,0.05)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="type-h3 text-[#1f1f1f]">{t("vendorPanel.orderDetails.modifiedItems")}</h3>
                    <p className="mt-1 text-sm text-[#746b63]">
                      {t("vendorPanel.orderDetails.modifiedDescription")}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#fff2e9] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                    <FiStar className="fill-current text-[12px]" />
                    {t("vendorPanel.orderDetails.changeCount", { count: modifiedItems.length })}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {modifiedItems.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[22px] border border-[#efe3d7] bg-white shadow-[0_10px_24px_rgba(31,22,15,0.05)]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-36 w-full object-cover"
                      />

                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-[#1f1f1f]">
                              {item.name}
                            </p>
                            <span className="mt-2 inline-flex rounded-full bg-[#fff3ea] px-2.5 py-1 text-[11px] font-semibold text-[#cf6e38]">
                              {item.changeLabel}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm leading-6 text-[#71675e]">
                          {item.summary}
                        </p>

                        <div className="rounded-[16px] bg-[#fcf7f2] p-3">
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a08d7d]">
                                {t("vendorPanel.orderDetails.previous")}
                              </p>
                              <p className="mt-1 text-[#5f554c]">{item.previousValue}</p>
                            </div>

                            <FiArrowRight className="shrink-0 text-[#cf6e38]" />

                            <div className="min-w-0 text-right">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a08d7d]">
                                {t("vendorPanel.orderDetails.updated")}
                              </p>
                              <p className="mt-1 font-semibold text-[#1f1f1f]">
                                {item.newValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {visibleVendorAdjustment ? (
              <section className="rounded-[24px] border border-[#f0d8c9] bg-[linear-gradient(180deg,#fff8f3_0%,#ffffff_100%)] p-5 shadow-[0_12px_24px_rgba(31,22,15,0.05)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#c67a4d]">
                      {hasPendingVendorAdjustment
                        ? "Vendor adjustment pending"
                        : "Vendor adjustment"}
                    </p>
                    <h3 className="mt-2 type-h3 text-[#1f1f1f]">
                      {hasPendingVendorAdjustment
                        ? "Review the vendor's requested changes"
                        : "Latest vendor adjustment"}
                    </h3>
                    {adjustmentNote.vendorNote ? (
                      <p className="mt-1 text-sm text-[#746b63]">
                        {adjustmentNote.vendorNote}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-[#746b63]">
                        Review the proposed details before responding.
                      </p>
                    )}
                  </div>
                  <span className="inline-flex rounded-full bg-[#fff1e8] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
                    {visibleVendorAdjustment.status || "PENDING"}
                  </span>
                </div>

                {includedDishReplacements.length > 0 || adjustmentNote.requestedDishChanges.length > 0 ? (
                  <div className="mt-4 rounded-[18px] border border-[#f0dfd3] bg-white p-4 shadow-[0_6px_18px_rgba(31,22,15,0.04)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                          Included dish replacements
                        </p>
                        <p className="mt-1 text-sm text-[#746b63]">
                          These dishes will be replaced within the existing menu price.
                        </p>
                      </div>
                      <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[11px] font-semibold text-[#cf6e38]">
                        {includedDishReplacements.length || adjustmentNote.requestedDishChanges.length} requested
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {includedDishReplacements.map((replacement, index) => (
                        <div
                          key={`${replacement.orderItemId}-${replacement.removedMenuItem?.id || index}`}
                          className="rounded-[14px] border border-[#f1e8e0] bg-[#fffaf6] px-3 py-2.5"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a08d7d]">Replace</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#6f6258] line-through">
                            {replacement.removedMenuItem?.title || "Included dish"}
                          </p>
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5d8b68]">
                            With {replacement.replacementMenu?.name || "Vendor menu"}
                          </p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#263529]">
                            {replacement.replacementMenuItem?.title || "Replacement dish"}
                          </p>
                        </div>
                      ))}
                      {adjustmentNote.requestedDishChanges.map((item, index) => {
                        const separatorIndex = item.indexOf(" - ");
                        const menuName = separatorIndex >= 0 ? item.slice(0, separatorIndex) : "Included dish";
                        const dishName = separatorIndex >= 0 ? item.slice(separatorIndex + 3) : item;

                        return (
                          <div
                            key={`${item}-${index}`}
                            className="rounded-[14px] border border-[#f1e8e0] bg-[#fffaf6] px-3 py-2.5"
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a08d7d]">
                              {menuName}
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-5 text-[#2b2622]">{dishName}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {adjustmentNote.suggestedMenuItems.length > 0 ||
                adjustmentNote.suggestedIncludedDishes.length > 0 ||
                adjustmentNote.customAlternativeSuggestions.length > 0 ? (
                  <div className="mt-4 rounded-[18px] border border-[#dce9df] bg-[#f9fdf9] p-4 shadow-[0_6px_18px_rgba(31,22,15,0.04)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5d8b68]">
                          Suggested alternatives
                        </p>
                        <p className="mt-1 text-sm text-[#617064]">
                          Review the replacements proposed by the vendor.
                        </p>
                      </div>
                      <span className="rounded-full bg-[#eaf5ee] px-2.5 py-1 text-[11px] font-semibold text-[#2f7a45]">
                        {adjustmentNote.suggestedMenuItems.length + adjustmentNote.suggestedIncludedDishes.length + adjustmentNote.customAlternativeSuggestions.length} suggested
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {adjustmentNote.suggestedMenuItems.map((item, index) => (
                        <div key={`menu-suggestion-${item}-${index}`} className="rounded-[14px] border border-[#dce9df] bg-white px-3 py-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78a083]">From vendor menu</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#263529]">{item}</p>
                        </div>
                      ))}
                      {adjustmentNote.suggestedIncludedDishes.map((item, index) => (
                        <div key={`included-dish-suggestion-${item}-${index}`} className="rounded-[14px] border border-[#eadfd2] bg-[#fffdfa] px-3 py-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a07b5e]">From another menu</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#352d27]">{item}</p>
                          <p className="mt-1 text-[11px] text-[#8b8177]">Included in the existing menu price.</p>
                        </div>
                      ))}
                      {adjustmentNote.customAlternativeSuggestions.map((item, index) => (
                        <div key={`custom-suggestion-${item}-${index}`} className="rounded-[14px] border border-[#eadfd2] bg-[#fffdfa] px-3 py-2.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a07b5e]">Custom alternative</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#352d27]">{item}</p>
                          <p className="mt-1 text-[11px] text-[#8b8177]">Price will be confirmed with you.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibleVendorAdjustment.proposedEventDate ? (
                    <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                        Proposed Date
                      </p>
                      <p className="mt-1 font-semibold text-[#1f1f1f]">
                        {visibleVendorAdjustment.proposedEventDate}
                      </p>
                    </div>
                  ) : null}
                  {visibleVendorAdjustment.proposedDeliveryWindowStart ? (
                    <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                        Proposed Time
                      </p>
                      <p className="mt-1 font-semibold text-[#1f1f1f]">
                        {visibleVendorAdjustment.proposedDeliveryWindowStart}
                      </p>
                    </div>
                  ) : null}
                  {visibleVendorAdjustment.proposedGuestCount ? (
                    <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                        Proposed Guests
                      </p>
                      <p className="mt-1 font-semibold text-[#1f1f1f]">
                        {visibleVendorAdjustment.proposedGuestCount}
                      </p>
                    </div>
                  ) : null}
                  {proposedAddress ? (
                    <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)] sm:col-span-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                        Proposed Address
                      </p>
                      <p className="mt-1 font-semibold text-[#1f1f1f]">
                        {proposedAddress}
                      </p>
                    </div>
                  ) : null}
                  {shouldShowPriceChange &&
                  (typeof visibleVendorAdjustment.oldTotal === "number" ||
                  typeof visibleVendorAdjustment.newTotal === "number") ? (
                    <>
                      <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                          Current Total
                        </p>
                        <p className="mt-1 font-semibold text-[#1f1f1f]">
                          {typeof visibleVendorAdjustment.oldTotal === "number"
                            ? `NOK ${visibleVendorAdjustment.oldTotal.toFixed(2)}`
                            : order.total}
                        </p>
                      </div>
                      <div className="rounded-[16px] bg-white px-4 py-3 shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                          Proposed Total
                        </p>
                        <p className="mt-1 font-semibold text-[#cf6e38]">
                          {typeof visibleVendorAdjustment.newTotal === "number"
                            ? `NOK ${visibleVendorAdjustment.newTotal.toFixed(2)}`
                            : order.total}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>

                {hasPendingVendorAdjustment ? (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={onApproveVendorAdjustment}
                      disabled={isResolvingVendorAdjustment}
                      className="rounded-full bg-[#cf6e38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResolvingVendorAdjustment ? "Updating..." : "Accept changes"}
                    </button>
                    <button
                      type="button"
                      onClick={onRejectVendorAdjustment}
                      disabled={isResolvingVendorAdjustment}
                      className="rounded-full border border-[#d9cec4] bg-white px-5 py-3 text-sm font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject changes
                    </button>
                  </div>
                ) : null}

              </section>
            ) : null}

            <section className="rounded-[24px] border border-[#efe5db] bg-[linear-gradient(180deg,#fffaf6_0%,#fff 100%)] p-5 shadow-[0_12px_24px_rgba(31,22,15,0.05)]">
              <h3 className="type-h3 text-[#1f1f1f]">{t("vendorPanel.orderDetails.orderInformation")}</h3>
              <div className="mt-4 grid gap-4 text-sm text-[#5d554d] sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.invoiceNumber")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">
                    {meta.invoiceId || t("vendorPanel.orderDetails.notAvailable")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.orderPlacedOn")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">
                    {meta.orderedDate || t("vendorPanel.orderDetails.notAvailable")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.eventDate")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">
                    {meta.eventDate || t("vendorPanel.orderDetails.notAvailable")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.eventTime")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">
                    {meta.eventTime || t("vendorPanel.orderDetails.notAvailable")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.guestCount")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{order.person}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.deliveryFee")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">{order.deliveryFee || "NOK 0.00"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                    {t("vendorPanel.orderDetails.deliveryAddress")}
                  </p>
                  <p className="mt-1 font-semibold text-[#1f1f1f]">
                    {meta.location || t("vendorPanel.orderDetails.notAvailable")}
                  </p>
                </div>
                {order.orderNotes ? (
                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9a8572]">
                      {t("vendorPanel.orderDetails.orderNotes")}
                    </p>
                    <p className="mt-1 rounded-[16px] bg-white px-4 py-3 font-medium text-[#1f1f1f] shadow-[0_6px_18px_rgba(31,22,15,0.05)]">
                      {order.orderNotes}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex items-center justify-between border-t border-[#ece4dc] bg-white/95 px-6 py-4 backdrop-blur-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9a8572]">
                {t("vendorPanel.orderDetails.grandTotal")}
              </p>
              <p className="mt-1 type-subpara text-[#6e645a]">
                {t("vendorPanel.orderDetails.grandTotalHint")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onModify ? (
                <button
                  type="button"
                  onClick={onModify}
                  disabled={isLoading || order.canModify === false}
                  className="rounded-full border border-[#d9cec4] bg-white px-4 py-2 text-sm font-semibold text-[#2b2622] transition hover:border-[#cf6e38] hover:text-[#cf6e38] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {order.canModify === false
                    ? t("vendorPanel.orderDetails.modificationClosed")
                    : t("vendorPanel.orderDetails.modifyOrder")}
                </button>
              ) : null}
              <p className="type-h2 text-[#1f1f1f]">{order.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
