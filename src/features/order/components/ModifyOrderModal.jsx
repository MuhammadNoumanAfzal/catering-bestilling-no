import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PreferredTimePicker from "../../../components/shared/PreferredTimePicker";
import {
  formatCurrency,
  getCheckoutTotals,
} from "../../checkOut/components/summary/checkoutSummaryUtils";
import {
  createInitialModifyOrderFormState,
  MODIFY_ORDER_PLACEHOLDERS,
} from "../constants/modifyOrderForm";
import { fetchVendorProfileBySlug } from "../../vendor/api/vendorService";
import {
  getConfiguredDeliverySlotsForDate,
  isVendorAvailableForPostalCode,
  isVendorClosedOnDate,
  isVendorDeliverySlotAvailable,
} from "../../vendor/services/vendorAvailability";

function formatDisplayDate(value, language) {
  if (!value) {
    return "";
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === "no" ? "nb-NO" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function formatSlotList(slots = []) {
  return slots
    .map((slot) => `${slot?.start ?? ""}-${slot?.end ?? ""}`.replace("-", " - "))
    .filter(Boolean)
    .join(", ");
}

function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTime24h(value) {
  const normalized = `${value ?? ""}`.trim();
  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return "";
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return "";
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function parseTimeToMinutes(value) {
  const normalized = normalizeTime24h(value);
  if (!normalized) {
    return null;
  }

  const [hours, minutes] = normalized.split(":").map(Number);
  return hours * 60 + minutes;
}

function isToday(dateValue) {
  return `${dateValue ?? ""}`.trim() === getTodayDateValue();
}

function validateModifyForm(formState, t, vendorProfile = null) {
  const address = `${formState.address ?? ""}`.trim();
  const city = `${formState.city ?? ""}`.trim();
  const postalCode = `${formState.postalCode ?? ""}`.trim();
  const date = `${formState.date ?? ""}`.trim();
  const time = normalizeTime24h(formState.time);
  const personCount = Math.max(1, Number(formState.personCount) || 1);
  const today = getTodayDateValue();

  if (!date) {
    return t("modifyOrder.errors.selectDate");
  }

  if (date < today) {
    return t("modifyOrder.errors.futureDate");
  }

  if (!time) {
    return t("modifyOrder.errors.selectTime");
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return t("modifyOrder.errors.time24h");
  }

  if (isToday(date)) {
    const selectedMinutes = parseTimeToMinutes(time);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (selectedMinutes != null && selectedMinutes < currentMinutes) {
      return t("modifyOrder.errors.futureTimeToday");
    }
  }

  if (!address) {
    return t("modifyOrder.errors.enterAddress");
  }

  if (!city) {
    return t("modifyOrder.errors.enterCity");
  }

  if (!postalCode) {
    return t("modifyOrder.errors.enterPostalCode");
  }

  if (!/^\d{4,5}$/.test(postalCode.replace(/\s+/g, ""))) {
    return t("modifyOrder.errors.postalCodeFormat");
  }

  if (personCount < 1) {
    return t("modifyOrder.errors.personCount");
  }

  if (vendorProfile) {
    if (!isVendorAvailableForPostalCode(vendorProfile, postalCode)) {
      return t("modifyOrder.errors.vendorPostalUnavailable", {
        postalCode,
        vendor: vendorProfile.name || t("modifyOrder.thisVendor"),
      });
    }

    if (isVendorClosedOnDate(vendorProfile, date)) {
      return t("modifyOrder.errors.vendorClosedOnDate", {
        vendor: vendorProfile.name || t("modifyOrder.thisVendor"),
      });
    }

    const availableSlots = getConfiguredDeliverySlotsForDate(vendorProfile, date);
    if (availableSlots.length === 0) {
      return t("modifyOrder.errors.vendorUnavailableOnDate", {
        vendor: vendorProfile.name || t("modifyOrder.thisVendor"),
      });
    }

    if (!isVendorDeliverySlotAvailable(vendorProfile, date, time)) {
      return t("modifyOrder.errors.vendorUnavailableAtTime", {
        vendor: vendorProfile.name || t("modifyOrder.thisVendor"),
        time,
      });
    }
  }

  return "";
}

export default function ModifyOrderModal({
  error = "",
  initialValue,
  isLoading = false,
  isSaving = false,
  pricingPreviewCarts = [],
  onCancel,
  onSave,
}) {
  const { t, i18n } = useTranslation();
  const [formState, setFormState] = useState(() =>
    createInitialModifyOrderFormState(initialValue),
  );
  const [validationError, setValidationError] = useState("");
  const [vendorProfile, setVendorProfile] = useState(null);
  const [isVendorAvailabilityLoading, setIsVendorAvailabilityLoading] = useState(false);

  useEffect(() => {
    setFormState(createInitialModifyOrderFormState(initialValue));
    setValidationError("");
  }, [initialValue]);

  useEffect(() => {
    let isMounted = true;
    const vendorSlug = `${initialValue?.vendorSlug ?? ""}`.trim();

    if (!vendorSlug) {
      setVendorProfile(null);
      setIsVendorAvailabilityLoading(false);
      return () => {
        isMounted = false;
      };
    }

    setIsVendorAvailabilityLoading(true);

    fetchVendorProfileBySlug(vendorSlug)
      .then((profile) => {
        if (isMounted) {
          setVendorProfile(profile || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setVendorProfile(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsVendorAvailabilityLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [initialValue?.vendorSlug]);

  const formattedDate = useMemo(
    () => formatDisplayDate(formState.date, i18n.language),
    [formState.date, i18n.language],
  );
  const normalizedTime = useMemo(
    () => normalizeTime24h(formState.time),
    [formState.time],
  );
  const availabilityState = useMemo(() => {
    if (!vendorProfile) {
      return null;
    }

    const vendorName = vendorProfile.name || t("modifyOrder.thisVendor");
    const normalizedPostalCode = `${formState.postalCode ?? ""}`.replace(/\s+/g, "");

    if (!formState.date || !normalizedPostalCode || !normalizedTime) {
      return {
        tone: "info",
        title: t("modifyOrder.availabilityNeedsInputTitle"),
        message: t("modifyOrder.availabilityNeedsInputMessage"),
      };
    }

    if (!/^\d{4,5}$/.test(normalizedPostalCode)) {
      return {
        tone: "error",
        title: t("modifyOrder.unavailableTitle"),
        message: t("modifyOrder.errors.postalCodeFormat"),
      };
    }

    if (!isVendorAvailableForPostalCode(vendorProfile, normalizedPostalCode)) {
      return {
        tone: "error",
        title: t("modifyOrder.unavailableTitle"),
        message: t("modifyOrder.errors.vendorPostalUnavailable", {
          postalCode: normalizedPostalCode,
          vendor: vendorName,
        }),
      };
    }

    if (isVendorClosedOnDate(vendorProfile, formState.date)) {
      return {
        tone: "error",
        title: t("modifyOrder.unavailableTitle"),
        message: t("modifyOrder.errors.vendorClosedOnDate", {
          vendor: vendorName,
        }),
      };
    }

    const availableSlots = getConfiguredDeliverySlotsForDate(vendorProfile, formState.date);
    const slotSummary = formatSlotList(availableSlots);

    if (availableSlots.length === 0) {
      return {
        tone: "error",
        title: t("modifyOrder.unavailableTitle"),
        message: t("modifyOrder.errors.vendorUnavailableOnDate", {
          vendor: vendorName,
        }),
      };
    }

    if (!isVendorDeliverySlotAvailable(vendorProfile, formState.date, normalizedTime)) {
      return {
        tone: "error",
        title: t("modifyOrder.unavailableTitle"),
        message: t("modifyOrder.errors.vendorUnavailableAtTime", {
          vendor: vendorName,
          time: normalizedTime,
        }),
        details: slotSummary
          ? t("modifyOrder.availableWindows", { windows: slotSummary })
          : "",
      };
    }

    return {
      tone: "success",
      title: t("modifyOrder.availableTitle"),
      message: t("modifyOrder.vendorAvailable", {
        vendor: vendorName,
      }),
      details: slotSummary
        ? t("modifyOrder.availableWindows", { windows: slotSummary })
        : "",
    };
  }, [formState.date, formState.postalCode, normalizedTime, t, vendorProfile]);
  const estimatedTotal = useMemo(() => {
    const carts = Array.isArray(pricingPreviewCarts) ? pricingPreviewCarts : [];

    if (carts.length === 0) {
      return "";
    }

    const updatedCarts = carts.map((cart) => ({
      ...cart,
      orderSummary: {
        ...cart.orderSummary,
        deliveryAddress: `${formState.address ?? ""}`.trim(),
        deliveryDate: formState.date,
        deliveryTime: normalizedTime,
        personCount: Math.max(1, Number(formState.personCount) || 1),
        pricing: null,
        previewItems: [],
        pricingCurrency: "NOK",
        availability: null,
      },
    }));
    const totals = getCheckoutTotals(updatedCarts);
    const grandTotal = Number(totals?.grandTotal ?? 0);

    if (!Number.isFinite(grandTotal) || grandTotal <= 0) {
      return "";
    }

    return `NOK ${formatCurrency(grandTotal)}`;
  }, [
    formState.address,
    formState.date,
    formState.personCount,
    normalizedTime,
    pricingPreviewCarts,
  ]);

  const updateField = (key, value) => {
    setValidationError("");
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const nextValidationError = validateModifyForm(formState, t, vendorProfile);

    if (nextValidationError) {
      setValidationError(nextValidationError);
      return;
    }

    if (isVendorAvailabilityLoading) {
      setValidationError(t("modifyOrder.checkingAvailability"));
      return;
    }

    onSave({
      address: formState.address.trim(),
      addressLine2: formState.addressLine2.trim(),
      city: formState.city.trim(),
      postalCode: formState.postalCode.trim(),
      date: formState.date,
      time: normalizedTime,
      personCount: Math.max(1, Number(formState.personCount) || 1),
      additionalDetails: formState.additionalDetails.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a1410]/50 px-3 py-3 backdrop-blur-[2px] sm:px-4 sm:py-4">
      <div className="flex max-h-[calc(100vh-24px)] w-full max-w-[620px] flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(20,15,10,0.22)] sm:max-h-[calc(100vh-32px)]">
        <div className="border-b border-[#eee4da] px-5 py-3 sm:px-6">
          <h2 className="type-h3 text-[#17120f]">{t("modifyOrder.title")}</h2>
          <p className="mt-0.5 text-[12px] text-[#7a7067]">
            {t("modifyOrder.subtitle")}
          </p>
        </div>

        <div className="space-y-3 overflow-y-auto px-4 py-4 sm:px-6">
          {error || validationError ? (
            <div className="rounded-[14px] border border-[#f1c8bb] bg-[#fff5f1] px-4 py-3 text-sm text-[#8a5642]">
              {validationError || error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-[14px] border border-[#efe4da] bg-[#fcf8f4] px-4 py-6 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#cf6e38] border-t-transparent"></div>
              <p className="mt-3 text-sm text-[#6f665d]">
                {t("modifyOrder.loading")}
              </p>
            </div>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("orderConfirmed.date")}
              </span>
              <input
                type="date"
                value={formState.date}
                onChange={(event) => updateField("date", event.target.value)}
                disabled={isLoading || isSaving}
                min={getTodayDateValue()}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
              {formattedDate ? (
                <p className="mt-1 text-[11px] text-[#8b8177]">
                  {t("modifyOrder.selectedDate", { date: formattedDate })}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("menu.time")}
              </span>
              <PreferredTimePicker
                value={normalizedTime}
                onChange={(value) => updateField("time", value)}
                selectedDate={formState.date}
                placeholder="HH:MM"
              />
            </label>
          </div>

          <label className="block">
            <span className="type-subpara mb-2 block text-[#2d2d2d]">
              {t("checkout.address")}
            </span>
            <input
              value={formState.address}
              onChange={(event) => updateField("address", event.target.value)}
              placeholder={MODIFY_ORDER_PLACEHOLDERS.address}
              disabled={isLoading || isSaving}
              className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block min-w-0">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("orderConfirmed.personCount")}
              </span>
              <div className="inline-flex h-10 w-full items-center overflow-hidden rounded-[10px] border border-[#dad1c8] bg-white">
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "personCount",
                      Math.max(1, Number(formState.personCount) - 1),
                    )
                  }
                  disabled={isLoading || isSaving}
                  className="h-full w-11 border-r border-[#dad1c8] text-[18px] text-[#322d29] transition hover:bg-[#faf5f0]"
                >
                  -
                </button>
                <span className="flex-1 text-center text-[15px] font-semibold text-[#1f1a16]">
                  {formState.personCount}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateField("personCount", Number(formState.personCount) + 1)
                  }
                  disabled={isLoading || isSaving}
                  className="h-full w-11 border-l border-[#dad1c8] text-[18px] text-[#322d29] transition hover:bg-[#faf5f0]"
                >
                  +
                </button>
              </div>
            </label>

            <label className="block min-w-0">
              <span className="type-subpara mb-2 block break-words text-[#2d2d2d]">
                {t("checkout.apartmentFloorOptional")}
              </span>
              <input
                value={formState.addressLine2}
                onChange={(event) =>
                  updateField("addressLine2", event.target.value)
                }
                placeholder={MODIFY_ORDER_PLACEHOLDERS.addressLine2}
                disabled={isLoading || isSaving}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("checkout.city")}
              </span>
              <input
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder={MODIFY_ORDER_PLACEHOLDERS.city}
                disabled={isLoading || isSaving}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>

            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("checkout.postalCode")}
              </span>
              <input
                value={formState.postalCode}
                onChange={(event) =>
                  updateField("postalCode", event.target.value)
                }
                placeholder={MODIFY_ORDER_PLACEHOLDERS.postalCode}
                disabled={isLoading || isSaving}
                className="h-10 w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
              />
            </label>
          </div>

          {isVendorAvailabilityLoading ? (
            <div className="rounded-[14px] border border-[#efe4da] bg-[#fcf8f4] px-4 py-3 text-sm text-[#6f665d]">
              {t("modifyOrder.checkingAvailability")}
            </div>
          ) : availabilityState ? (
            <div
              className={`rounded-[14px] border px-4 py-3 text-sm ${
                availabilityState.tone === "success"
                  ? "border-[#cce8d3] bg-[#effaf2] text-[#256c3c]"
                  : availabilityState.tone === "error"
                    ? "border-[#f1c8bb] bg-[#fff5f1] text-[#8a5642]"
                    : "border-[#d6e3f5] bg-[#f5f9ff] text-[#355276]"
              }`}
            >
              <p className="font-semibold">
                {availabilityState.title}
              </p>
              <p className="mt-1">
                {availabilityState.message}
              </p>
              {availabilityState.details ? (
                <p className="mt-1 text-[12px] opacity-90">
                  {availabilityState.details}
                </p>
              ) : null}
            </div>
          ) : null}

          {estimatedTotal ? (
            <div className="rounded-[14px] border border-[#efe4da] bg-[#fcf8f4] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a48d79]">
                {t("orderConfirmed.proposedTotal")}
              </p>
              <p className="mt-2 text-[16px] font-semibold text-[#201b17]">
                {estimatedTotal}
              </p>
            </div>
          ) : null}

          <label className="block">
            <span className="type-subpara mb-2 block text-[#2d2d2d]">
              {t("modifyOrder.additionalDetails")}
            </span>
            <textarea
              value={formState.additionalDetails}
              onChange={(event) =>
                updateField("additionalDetails", event.target.value)
              }
              placeholder={MODIFY_ORDER_PLACEHOLDERS.additionalDetails}
              disabled={isLoading || isSaving}
              className="min-h-[88px] w-full rounded-[10px] border border-[#dad1c8] bg-white px-3 py-2.5 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#eee4da] px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full rounded-[10px] border border-[#d9cec4] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#2b2622] transition hover:bg-[#faf7f3] sm:w-auto"
          >
            {t("alerts.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isSaving || isVendorAvailabilityLoading}
            className="w-full rounded-[10px] bg-[#cf6e38] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d] sm:w-auto"
          >
            {isSaving ? t("modifyOrder.sending") : t("modifyOrder.sendRequest")}
          </button>
        </div>
      </div>
    </div>
  );
}
