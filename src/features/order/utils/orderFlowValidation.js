export function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeTimeValue(timeValue) {
  const normalized = `${timeValue ?? ""}`.trim();
  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);

  if (!match) {
    return null;
  }

  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

const MENU_DAY_TO_INDEX = {
  su: 0,
  mo: 1,
  tu: 2,
  we: 3,
  th: 4,
  fr: 5,
  sa: 6,
};

const MENU_DAY_LABELS = {
  su: "Sunday",
  mo: "Monday",
  tu: "Tuesday",
  we: "Wednesday",
  th: "Thursday",
  fr: "Friday",
  sa: "Saturday",
};

function normalizeDateOnlyValue(dateValue) {
  const normalizedValue = `${dateValue ?? ""}`.trim();

  if (!normalizedValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return normalizedValue;
  }

  const parsedDate = new Date(normalizedValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateToDayIndex(dateValue) {
  const normalizedDate = normalizeDateOnlyValue(dateValue);

  if (!normalizedDate) {
    return null;
  }

  const [year, month, day] = normalizedDate.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getDay();
}

function normalizeAvailableDays(availableDays = []) {
  return availableDays
    .map((day) => `${day ?? ""}`.trim().toLowerCase())
    .filter((day) => day in MENU_DAY_TO_INDEX);
}

function buildAvailableDaysLabel(availableDays = []) {
  const labels = normalizeAvailableDays(availableDays)
    .map((day) => MENU_DAY_LABELS[day])
    .filter(Boolean);

  return labels.join(", ");
}

export function getMenuAvailabilityError(menuLike, deliveryDate) {
  const normalizedDate = normalizeDateOnlyValue(deliveryDate);

  if (!normalizedDate) {
    return "";
  }

  const itemName = `${menuLike?.title || menuLike?.name || "This menu"}`.trim();
  const normalizedAvailableDays = normalizeAvailableDays(
    menuLike?.availableDays || menuLike?.menuAvailability?.availableDays || [],
  );

  if (normalizedAvailableDays.length > 0) {
    const selectedDayIndex = normalizeDateToDayIndex(normalizedDate);
    const matchesDay = normalizedAvailableDays.some(
      (day) => MENU_DAY_TO_INDEX[day] === selectedDayIndex,
    );

    if (!matchesDay) {
      const availableDaysLabel = buildAvailableDaysLabel(normalizedAvailableDays);
      return availableDaysLabel
        ? `${itemName} is not available on the selected day. It can only be ordered on ${availableDaysLabel}.`
        : `${itemName} is not available on the selected day.`;
    }
  }

  const isAvailabilityWindowEnabled = Boolean(
    menuLike?.isAvailabilityWindowEnabled ??
      menuLike?.menuAvailability?.isAvailabilityWindowEnabled,
  );
  const availableFrom =
    menuLike?.availableFrom || menuLike?.menuAvailability?.availableFrom || "";
  const availableUntil =
    menuLike?.availableUntil || menuLike?.menuAvailability?.availableUntil || "";

  if (isAvailabilityWindowEnabled) {
    const normalizedStart = normalizeDateOnlyValue(availableFrom);
    const normalizedEnd = normalizeDateOnlyValue(availableUntil);

    if (normalizedStart && normalizedDate < normalizedStart) {
      return `${itemName} is not available before ${normalizedStart}.`;
    }

    if (normalizedEnd && normalizedDate > normalizedEnd) {
      return `${itemName} is not available after ${normalizedEnd}.`;
    }
  }

  return "";
}

export function validateOrderSummaryBasics({
  deliveryDate,
  deliveryTime,
  deliveryAddress,
  personCount,
  minimumPersons = 1,
}) {
  const normalizedDate = `${deliveryDate ?? ""}`.trim();
  const normalizedTime = `${deliveryTime ?? ""}`.trim();
  const normalizedAddress = `${deliveryAddress ?? ""}`.trim();
  const normalizedPersonCount = Math.max(
    Number(minimumPersons ?? 1) || 1,
    Number(personCount ?? 0) || 0,
  );

  if (!normalizedDate) {
    return "Please select a delivery date.";
  }

  if (normalizedDate < getTodayDateValue()) {
    return "Please select today or a future delivery date.";
  }

  if (!normalizedTime) {
    return "Please select a delivery time.";
  }

  if (normalizedDate === getTodayDateValue()) {
    const selectedMinutes = normalizeTimeValue(normalizedTime);

    if (selectedMinutes != null) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      if (selectedMinutes < currentMinutes) {
        return "Please select a future delivery time for today.";
      }
    }
  }

  if (!normalizedAddress) {
    return "Please enter the delivery address.";
  }

  if (normalizedPersonCount < (Number(minimumPersons ?? 1) || 1)) {
    return `Person count must be at least ${minimumPersons}.`;
  }

  return "";
}

function isValidEmail(value) {
  const normalizedValue = `${value ?? ""}`.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue);
}

export function validateCheckoutForm({ formState, checkoutType, carts = [] }) {
  const commonError = validateOrderSummaryBasics({
    deliveryDate: formState.date,
    deliveryTime: formState.time,
    deliveryAddress: formState.deliveryAddress,
    personCount: formState.personCount,
    minimumPersons: 1,
  });

  if (commonError) {
    return commonError;
  }

  if (!`${formState.deliveryPostalCode ?? ""}`.trim()) {
    return "Please enter the delivery postal code.";
  }

  if (Array.isArray(carts)) {
    for (const cart of carts) {
      const items = Array.isArray(cart?.orderSummary?.items)
        ? cart.orderSummary.items
        : [];

      for (const item of items) {
        if (item?.isAddOn) {
          continue;
        }

        const menuAvailabilityError = getMenuAvailabilityError(item, formState.date);
        if (menuAvailabilityError) {
          return menuAvailabilityError;
        }
      }
    }
  }

  const deliveryPostalCode = `${formState.deliveryPostalCode ?? ""}`.trim();
  if (deliveryPostalCode && Array.isArray(carts)) {
    const normalizedInput = deliveryPostalCode.replace(/\D/g, "");
    for (const cart of carts) {
      const vendor = cart?.vendor;
      if (vendor) {
        const servicePostalCodes = Array.isArray(vendor.servicePostalCodes)
          ? vendor.servicePostalCodes
          : [];

        if (servicePostalCodes.length > 0) {
          const isMatched = servicePostalCodes.some((candidate) => {
            const normalizedCandidate = `${candidate}`.replace(/\D/g, "");
            return (
              normalizedCandidate.startsWith(normalizedInput) ||
              normalizedInput.startsWith(normalizedCandidate)
            );
          });

          if (!isMatched) {
            return `The vendor "${vendor.name}" does not deliver to postal code ${deliveryPostalCode}.`;
          }
        }
      }
    }
  }

  if (!`${formState.deliveryCity ?? ""}`.trim()) {
    return "Please enter the delivery city.";
  }

  if (!`${formState.invoiceAddress ?? ""}`.trim()) {
    return "Please enter the invoice address.";
  }

  if (!`${formState.invoicePostalCode ?? ""}`.trim()) {
    return "Please enter the invoice postal code.";
  }

  if (!`${formState.invoiceCity ?? ""}`.trim()) {
    return "Please enter the invoice city.";
  }

  if (!`${formState.invoiceReference ?? ""}`.trim()) {
    return "Please enter the invoice reference.";
  }

  if (!`${formState.phone ?? ""}`.trim()) {
    return "Please enter the phone number.";
  }

  if (!isValidEmail(formState.email)) {
    return "Please enter a valid email address.";
  }

  if (checkoutType === "corporate") {
    if (!`${formState.companyName ?? ""}`.trim()) {
      return "Please enter the company name.";
    }

    if (!`${formState.organizationNumber ?? ""}`.trim()) {
      return "Please enter the organization number.";
    }

    if (!`${formState.eventName ?? ""}`.trim()) {
      return "Please enter the event name.";
    }
  } else {
    if (!`${formState.firstName ?? ""}`.trim()) {
      return "Please enter the first name.";
    }

    if (!`${formState.lastName ?? ""}`.trim()) {
      return "Please enter the last name.";
    }

    if (!`${formState.occasion ?? ""}`.trim()) {
      return "Please enter the occasion.";
    }
  }

  return "";
}
