import {FiX,FiCreditCard} from "react-icons/fi";
import {graphqlRequest} from "../../../lib/api/graphqlClient";

import {MODIFICATION_PRICING_CONTEXT,ORDER_MODIFICATION_PREVIEW,buildOrderModificationPreviewInput,orderModificationAmounts} from "../api/modificationPricing.js";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { normalizeModifyOrderTime } from "../utils/modifyOrderTime.js";
import PreferredTimePicker from "../../../components/shared/PreferredTimePicker";
import {
  formatCurrency,
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

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTime24h(value) {
  return normalizeModifyOrderTime(value);
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
  const personCount = Number(formState.personCount);
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

  if (!/^\d{4}$/.test(postalCode.replace(/\s+/g, ""))) {
    return t("modifyOrder.errors.postalCodeFormat");
  }

  if (!Number.isInteger(personCount) || personCount < 1) {
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
  onCancel,
  onSave,
}) {
  const { t, i18n } = useTranslation();
  const [formState, setFormState] = useState(() =>
    createInitialModifyOrderFormState(initialValue),
  );
  const [pricingContext, setPricingContext] = useState(null);
  const [liveEstimate, setLiveEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [vendorProfile, setVendorProfile] = useState(null);
  const [isVendorAvailabilityLoading, setIsVendorAvailabilityLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const selectedDate = initialValue?.date
      ? new Date(`${initialValue.date}T00:00:00`)
      : new Date();
    return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  });

  useEffect(() => {
    setFormState(createInitialModifyOrderFormState(initialValue));
    setValidationError("");
  }, [initialValue?.orderId, initialValue?.address, initialValue?.addressLine2, initialValue?.city, initialValue?.postalCode, initialValue?.date, initialValue?.time, initialValue?.personCount, initialValue?.additionalDetails]);

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
  const deliverySlots = useMemo(
    () => getConfiguredDeliverySlotsForDate(vendorProfile, formState.date),
    [formState.date, vendorProfile],
  );
  const selectedDeliverySlot = useMemo(
    () =>
      deliverySlots.find(
        (slot) => normalizedTime >= slot.start && normalizedTime <= slot.end,
      ) || null,
    [deliverySlots, normalizedTime],
  );
  const editableDeliverySlot = selectedDeliverySlot || deliverySlots[0] || null;
  const calendarDays = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => {
        const firstWeekday = (calendarMonth.getDay() + 6) % 7;
        const date = new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth(),
          index - firstWeekday + 1,
        );
        const value = formatDateValue(date);
        const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
        const isAvailable =
          isCurrentMonth &&
          value >= getTodayDateValue() &&
          Boolean(vendorProfile) &&
          getConfiguredDeliverySlotsForDate(vendorProfile, value).length > 0;

        return { date, value, isAvailable };
      }),
    [calendarMonth, vendorProfile],
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

    if (!/^\d{4}$/.test(normalizedPostalCode)) {
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
  useEffect(() => {
    if (!initialValue?.orderId) return;
    let active = true; setPricingContext(null);
    graphqlRequest({query: MODIFICATION_PRICING_CONTEXT, variables:{id:initialValue.orderId}})
      .then(data=>{if(active)setPricingContext(data?.clientOrder || null);})
      .catch(()=>{if(active)setEstimateError(true);});
    return ()=>{active=false;};
  },[initialValue?.orderId]);
  const estimateInput = useMemo(() => {
    try { return buildOrderModificationPreviewInput(pricingContext,{...formState,time:normalizedTime}); }
    catch { return null; }
  },[pricingContext,formState.date,formState.time,formState.address,formState.city,formState.postalCode,formState.personCount,normalizedTime]);
  useEffect(() => {
    let active=true;setLiveEstimate(null);setEstimateError(false);
    if(!estimateInput){setEstimateLoading(false);return;}
    setEstimateLoading(true);
    const timer=setTimeout(()=>{
      graphqlRequest({query:ORDER_MODIFICATION_PREVIEW,variables:{orderId:initialValue.orderId,input:estimateInput}})
        .then(data=>{if(active){if(data?.orderModificationPreview?.proposedTotal==null)throw new Error("Estimate unavailable");setLiveEstimate(data.orderModificationPreview);}})
        .catch(()=>{if(active)setEstimateError(true);})
        .finally(()=>{if(active)setEstimateLoading(false);});
    },450);
    return()=>{active=false;clearTimeout(timer);};
  },[estimateInput,initialValue?.orderId]);
  const amounts = orderModificationAmounts(liveEstimate, pricingContext?.grandTotal ?? initialValue?.currentTotal);

  const updateField = (key, value) => {
    setValidationError("");
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleDeliveryDateSelect = (date) => {
    if (vendorProfile && getConfiguredDeliverySlotsForDate(vendorProfile, date).length === 0) {
      return;
    }

    setValidationError("");
    setFormState((current) => ({ ...current, date, time: "" }));
    setIsCalendarOpen(false);
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
      <div role="dialog" aria-modal="true" aria-labelledby="modify-order-title" className="flex max-h-[calc(100dvh-24px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[18px] border border-[#e7d9ce] bg-white shadow-[0_24px_80px_rgba(20,15,10,0.22)] [&_button:enabled]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_input]:text-[13px] [&_textarea]:text-[13px] [&_.type-subpara]:mb-1 [&_.type-subpara]:text-[12px]">
        <header className="flex items-start justify-between gap-4 border-b border-[#ece5dd] bg-white px-5 py-4">
          <div><h2 id="modify-order-title" className="text-[19px] font-semibold tracking-tight text-[#30251d]">{t("modifyEnhance.title")}</h2><p className="mt-1 text-xs text-[#9c8773]">{t("modifyEnhance.subtitle")}</p></div>
          <button type="button" disabled={isSaving} onClick={onCancel} aria-label={t("alerts.cancel")} className="rounded-lg p-2 text-[#9b8776] hover:bg-[#f7f3ee]"><FiX size={18}/></button>
        </header>
        <div className="min-h-0 space-y-4 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <section className="rounded-xl border border-[#eadfce] bg-[#fbf8f3] p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div><p className="text-[11px] text-[#9d8872]">{t("modifyEnhance.current")}</p><p className="mt-1 text-lg font-semibold tabular-nums text-[#382d24]">{amounts.current==null ? t("modifyEnhance.unavailable") : formatCurrency(amounts.current)}</p></div>
              <div><p className="text-[11px] text-[#9d8872]">{t("modifyEnhance.estimate")}</p><p className="mt-1 text-lg font-semibold tabular-nums text-[#ba6537]">{estimateLoading?t("modifyEnhance.calculating"):amounts.proposed==null?t("modifyEnhance.unavailable"):formatCurrency(amounts.proposed)}</p></div>
              <div className="col-span-2 border-t border-[#eaddcb] pt-2 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0"><p className="text-[11px] text-[#9d8872]">{t("modifyEnhance.difference")}</p><p className="mt-1 text-lg font-semibold tabular-nums">{amounts.delta==null?t("modifyEnhance.unavailable"):(amounts.delta>0?"+":"")+formatCurrency(amounts.delta)}</p></div>
            </div>
            {liveEstimate?.isEligible === false && <p role="alert" className="mt-3 text-xs text-red-700">{liveEstimate.eligibilityReason || t("modifyEnhance.unavailable")}</p>}
            <p className="mt-3 text-[11px] leading-5 text-[#9a826a]">{t(estimateError?"modifyEnhance.estimateError":"modifyEnhance.estimateHint")}</p>
          </section>
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

          <section className="rounded-[14px] border border-[#eee4da] bg-white p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a48673]">
                  {t("modifyEnhance.schedule")}
                </p>
              </div>
              {formState.date && normalizedTime ? (
                <span className="shrink-0 rounded-full bg-[#eaf5ee] px-2.5 py-1 text-[11px] font-semibold text-[#2f7a45]">
                  {t("modifyEnhance.selected")}
                </span>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("orderConfirmed.date")}
              </span>
              <div className="relative">
                <button
                  type="button"
                  disabled={isLoading || isSaving || isVendorAvailabilityLoading || !vendorProfile}
                  onClick={() => setIsCalendarOpen((current) => !current)}
                  className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#dad1c8] bg-white px-3 text-left text-sm text-[#26211d] outline-none transition hover:border-[#cf6e38] disabled:cursor-not-allowed disabled:bg-[#faf7f4] disabled:text-[#a2978c]"
                >
                  <span>{formattedDate || t("modifyEnhance.chooseDate")}</span>
                  <span className="text-[#cf6e38]">&#128197;</span>
                </button>
                {isCalendarOpen ? (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-[300px] rounded-[16px] border border-[#dfd4cb] bg-white p-3 shadow-[0_18px_38px_rgba(55,34,19,0.18)]">
                    <div className="mb-3 flex items-center justify-between">
                      <button type="button" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="rounded-full px-2 py-1 text-[18px] text-[#6f6056] hover:bg-[#faf4ef]">&#8249;</button>
                      <strong className="text-[14px] text-[#2b231e]">
                        {calendarMonth.toLocaleString(i18n.language.startsWith("no")?"nb-NO":"en-GB", { month: "long", year: "numeric" })}
                      </strong>
                      <button type="button" onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="rounded-full px-2 py-1 text-[18px] text-[#6f6056] hover:bg-[#faf4ef]">&#8250;</button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[#8c7a6e]">
                      {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day}>{day}</span>)}
                    </div>
                    <div className="mt-2 grid grid-cols-7 gap-1">
                      {calendarDays.map(({ date, value, isAvailable }) => {
                        const isSelected = value === formState.date;
                        return (
                          <button
                            key={value}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleDeliveryDateSelect(value)}
                            className={`h-9 rounded-[8px] text-[12px] font-semibold transition ${isSelected ? "bg-[#cf6e38] text-white" : isAvailable ? "cursor-pointer text-[#2b231e] hover:bg-[#fff0e8] hover:text-[#cf6e38]" : "cursor-not-allowed text-[#c9beb5] line-through"}`}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-3 border-t border-[#efe4dc] pt-2 text-[11px] leading-4 text-[#8a7161]">
                      {t("modifyEnhance.availableDates")}
                    </p>
                  </div>
                ) : null}
              </div>
              {!vendorProfile ? (
                <p className="mt-1 text-[11px] text-[#8b8177]">
                  {isVendorAvailabilityLoading
                    ? t("modifyOrder.checkingAvailability")
                    : t("modifyOrder.loadFailed")}
                </p>
              ) : null}
            </label>

            <div className="block">
              <span className="type-subpara mb-2 block text-[#2d2d2d]">
                {t("menu.time")}
              </span>
              {!formState.date ? (
                <div className="h-10 rounded-[10px] border border-[#dad1c8] bg-[#faf7f4] px-3 py-2.5 text-sm text-[#9b8f84]">
                  {t("modifyEnhance.chooseDateFirst")}
                </div>
              ) : isLoading || isVendorAvailabilityLoading || !vendorProfile ? (
                <div className="rounded-[10px] border border-[#dad1c8] bg-[#faf7f4] px-3 py-2 text-sm text-[#8b8177]">
                  {isLoading || isVendorAvailabilityLoading
                    ? t("modifyOrder.loading")
                    : t("modifyOrder.loadFailed")}
                </div>
              ) : deliverySlots.length === 0 ? (
                <div className="rounded-[10px] border border-[#f1c8bb] bg-[#fff5f1] px-3 py-2 text-sm text-[#8a5642]">
                  {t("modifyEnhance.noTimes")}
                </div>
              ) : (
                <div className="space-y-2">
                  <PreferredTimePicker
                    value={normalizedTime}
                    onChange={(value) => updateField("time", value)}
                    selectedDate={formState.date}
                    minTimeValue={editableDeliverySlot?.start || ""}
                    maxTimeValue={editableDeliverySlot?.end || ""}
                    placeholder="HH:MM"
                  />
                  <select aria-label={t("modifyEnhance.window")} disabled={isLoading||isSaving} value={selectedDeliverySlot?.start || ""} onChange={event=>updateField("time",event.target.value)} className="h-9 w-full rounded-lg border border-[#e3d8cc] bg-[#fcfaf7] px-2 text-xs text-[#8a725c]">
                    <option value="">{t("modifyEnhance.window")}</option>{deliverySlots.map(slot=><option key={slot.start+slot.end} value={slot.start}>{slot.label}</option>)}
                  </select>
                </div>
              )}
            </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#eee4da] bg-white p-3">
            <div className="mb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#a48673]">
                {t("modifyEnhance.delivery")}
              </p>
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

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                <input aria-label={t("orderConfirmed.personCount")} type="number" inputMode="numeric" min="1" step="1" value={formState.personCount} disabled={isLoading||isSaving} onChange={event=>updateField("personCount",event.target.value)} className="h-full min-w-0 flex-1 bg-white text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
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

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
          </section>

          {isVendorAvailabilityLoading ? (
            <div className="rounded-[14px] border border-[#efe4da] bg-[#fcf8f4] px-4 py-3 text-sm text-[#6f665d]">
              {t("modifyOrder.checkingAvailability")}
            </div>
          ) : availabilityState && availabilityState.tone !== "success" ? (
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
              rows={2}
              className="min-h-[56px] w-full resize-y rounded-[10px] border border-[#dad1c8] bg-white px-3 py-2 text-[#26211d] outline-none transition placeholder:text-[#a2978c] focus:border-[#cf6e38] focus:shadow-[0_0_0_3px_rgba(207,110,56,0.12)]"
            />
          </label>
        </div>

        <div className="shrink-0 border-t border-[#eee4da] bg-white px-4 py-3 sm:px-6">
          {validationError || error ? (
            <p role="alert" aria-live="assertive" className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {validationError || error}
            </p>
          ) : null}
          <p className="mb-3 flex items-start gap-2 text-[11px] leading-5 text-[#a18c76]"><FiCreditCard className="mt-0.5 shrink-0" size={14}/>{t("modifyEnhance.paymentHint")}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="mr-auto"><p className="text-[10px] text-[#a18c76]">{t("modifyEnhance.estimate")}</p><p className="text-base font-semibold tabular-nums text-[#9f5d36]">{estimateLoading?t("modifyEnhance.calculating"):amounts.proposed==null?t("modifyEnhance.unavailable"):formatCurrency(amounts.proposed)}</p></div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="rounded-[10px] border border-[#d9cec4] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#2b2622] transition hover:bg-[#faf7f3] sm:w-auto"
          >
            {t("alerts.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isSaving || isVendorAvailabilityLoading}
            className="cursor-pointer rounded-[10px] bg-[#cf6e38] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#bb602d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? t("modifyOrder.sending") : t("modifyOrder.sendRequest")}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
