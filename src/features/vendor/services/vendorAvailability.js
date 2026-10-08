function normalizePostalCode(postalCode = "") {
  const digits = `${postalCode}`.replace(/\D/g, "");

  return /^\d{1,4}$/.test(digits) ? digits.padStart(4, "0") : digits;
}

function normalizeLocationQuery(locationQuery = "") {
  return `${locationQuery}`.trim().toLowerCase();
}

function resolveVendorReference(vendor) {
  return vendor ?? null;
}

function getVendorServiceAreas(vendor) {
  return Array.isArray(vendor?.serviceAreas) ? vendor.serviceAreas : [];
}

function resolveVendorPostalCoverage(vendor) {
  const serviceAreaPostCodes = getVendorServiceAreas(vendor)
    .map((area) => `${area?.postCode ?? ""}`.trim())
    .filter(Boolean);
  const storedServicePostCodes = Array.isArray(vendor?.servicePostalCodes)
    ? vendor.servicePostalCodes.map((value) => `${value ?? ""}`.trim()).filter(Boolean)
    : [];

  return [...new Set([...serviceAreaPostCodes, ...storedServicePostCodes])];
}

function resolveVendorServiceAreaNames(vendor) {
  return getVendorServiceAreas(vendor)
    .map((area) => `${area?.name ?? ""}`.trim())
    .filter(Boolean);
}

function isDateValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}

function normalizeSelectedDate(date) {
  if (!date || !isDateValid(date)) {
    return null;
  }

  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const normalizedDate = `${date}`.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    const [year, month, day] = normalizedDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsedDate = new Date(normalizedDate);
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
}

function normalizeDateKey(date) {
  const normalizedDate = normalizeSelectedDate(date);

  if (!normalizedDate) {
    return "";
  }

  const year = normalizedDate.getFullYear();
  const month = `${normalizedDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${normalizedDate.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function normalizeClosureStatus(status) {
  return `${status ?? ""}`.trim().toLowerCase();
}

function isBlockingClosureStatus(status) {
  const normalizedStatus = normalizeClosureStatus(status);

  return !["cancelled", "canceled", "inactive", "deleted"].includes(normalizedStatus);
}

function getVendorSpecialClosures(vendor) {
  return Array.isArray(vendor?.specialClosures) ? vendor.specialClosures : [];
}

export function getVendorClosureForDate(vendor, date) {
  const selectedDateKey = normalizeDateKey(date);

  if (!selectedDateKey) {
    return null;
  }

  return (
    getVendorSpecialClosures(vendor).find((closure) => {
      const startDateKey = normalizeDateKey(closure?.startDate || closure?.start);
      const endDateKey = normalizeDateKey(closure?.endDate || closure?.end);

      if (!startDateKey || !endDateKey || !isBlockingClosureStatus(closure?.status)) {
        return false;
      }

      return selectedDateKey >= startDateKey && selectedDateKey <= endDateKey;
    }) || null
  );
}

export function isVendorClosedOnDate(vendor, date) {
  return Boolean(getVendorClosureForDate(vendor, date));
}

function createSlotLabel(start, end) {
  return `${start} - ${end}`;
}

function parseTimeParts(time) {
  const match = `${time ?? ""}`.trim().match(/^(\d{1,2}):(\d{2})/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}

function createLocalDateTime(date, time) {
  const selectedDate = normalizeSelectedDate(date);
  const timeParts = parseTimeParts(time);

  if (!selectedDate || !timeParts) {
    return null;
  }

  return new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    timeParts.hours,
    timeParts.minutes,
    0,
    0,
  );
}

function formatTimeValue(date) {
  return `${date.getHours()}`.padStart(2, "0") + `:${date.getMinutes()}`.padStart(2, "0");
}

function roundDateUpToStep(date, stepMinutes = 15) {
  const nextDate = new Date(date.getTime());
  const stepMs = stepMinutes * 60 * 1000;
  const roundedTime = Math.ceil(nextDate.getTime() / stepMs) * stepMs;
  nextDate.setTime(roundedTime);
  nextDate.setSeconds(0, 0);
  return nextDate;
}

function resolveMinimumOrderNoticeHours(vendor) {
  const candidates = [
    vendor?.minimumOrderNoticeHours,
    vendor?.availability?.delivery?.minimumOrderNoticeHours,
    vendor?.deliverySettings?.minimumOrderNoticeHours,
  ];
  const noticeHours = candidates
    .map((value) => Number(value))
    .find((value) => Number.isFinite(value) && value > 0);

  return noticeHours || 0;
}

function getMinimumDeliveryDateTime(vendor, now = new Date()) {
  const noticeHours = resolveMinimumOrderNoticeHours(vendor);

  if (noticeHours <= 0) {
    return null;
  }

  return new Date(now.getTime() + noticeHours * 60 * 60 * 1000);
}

function getLeadTimeAdjustedSlot(slot, vendor, date, now = new Date()) {
  const minimumDateTime = getMinimumDeliveryDateTime(vendor, now);

  if (!minimumDateTime) {
    return slot;
  }

  const slotEndDateTime = createLocalDateTime(date, slot?.end);

  if (!slotEndDateTime || slotEndDateTime < minimumDateTime) {
    return null;
  }

  const slotStartDateTime = createLocalDateTime(date, slot?.start);

  if (!slotStartDateTime || slotStartDateTime >= minimumDateTime) {
    return slot;
  }

  const adjustedStartDateTime = roundDateUpToStep(minimumDateTime);

  if (adjustedStartDateTime > slotEndDateTime) {
    return null;
  }

  const adjustedStart = formatTimeValue(adjustedStartDateTime);

  return {
    ...slot,
    start: adjustedStart,
    label: createSlotLabel(adjustedStart, slot.end),
  };
}

function satisfiesMinimumOrderNotice(vendor, date, time) {
  const minimumDateTime = getMinimumDeliveryDateTime(vendor);
  const selectedDateTime = createLocalDateTime(date, time);

  if (!minimumDateTime || !selectedDateTime) {
    return true;
  }

  return selectedDateTime >= minimumDateTime;
}

function normalizeSlotDay(day) {
  const normalized = `${day ?? ""}`.trim().toLowerCase();

  switch (normalized) {
    case "0":
    case "sun":
    case "sunday":
      return "su";
    case "1":
    case "mon":
    case "monday":
      return "mo";
    case "2":
    case "tue":
    case "tuesday":
      return "tu";
    case "3":
    case "wed":
    case "wednesday":
      return "we";
    case "4":
    case "thu":
    case "thursday":
      return "th";
    case "5":
    case "fri":
    case "friday":
      return "fr";
    case "6":
    case "sat":
    case "saturday":
      return "sa";
    default:
      return normalized;
  }
}

function normalizeScheduleDayIndex(day) {
  if (day === null || day === undefined || `${day}`.trim() === "") {
    return null;
  }

  if (typeof day === "number" && Number.isInteger(day) && day >= 0 && day <= 6) {
    return day;
  }

  const normalizedDay = normalizeSlotDay(day);

  switch (normalizedDay) {
    case "su":
      return 0;
    case "mo":
      return 1;
    case "tu":
      return 2;
    case "we":
      return 3;
    case "th":
      return 4;
    case "fr":
      return 5;
    case "sa":
      return 6;
    default:
      return null;
  }
}

function getSelectedDayCode(date) {
  const selectedDate = normalizeSelectedDate(date);

  if (!selectedDate) {
    return "";
  }

  return ["su", "mo", "tu", "we", "th", "fr", "sa"][selectedDate.getDay()] || "";
}

export function isVendorAvailableForPostalCode(vendor, postalCode) {
  if (`${postalCode ?? ""}`.trim() && !/^\d{4}$/.test(`${postalCode}`.trim())) return false;
  const normalizedInput = normalizePostalCode(postalCode);

  if (!normalizedInput) {
    return true;
  }

  return resolveVendorPostalCoverage(vendor).some((candidate) =>
    normalizePostalCode(candidate) === normalizedInput,
  );
}

export function filterVendorsByPostalCode(vendors, postalCode) {
  return vendors.filter((vendor) =>
    isVendorAvailableForPostalCode(vendor, postalCode),
  );
}

export function isVendorAvailableForLocation(vendor, locationQuery) {
  const normalizedPostalCode = /^\d+$/.test(`${locationQuery ?? ""}`.trim())
    ? `${locationQuery}`.trim()
    : "";
  const matchedVendor = resolveVendorReference(vendor);

  if (normalizedPostalCode) {
    return isVendorAvailableForPostalCode(vendor, normalizedPostalCode);
  }

  const normalizedQuery = normalizeLocationQuery(locationQuery);

  if (!normalizedQuery) {
    return true;
  }

  const serviceAreaNames = resolveVendorServiceAreaNames(matchedVendor);

  return serviceAreaNames.some((value) =>
    normalizeLocationQuery(value).includes(normalizedQuery),
  );
}

export function filterVendorsByLocation(vendors, locationQuery) {
  return vendors.filter((vendor) =>
    isVendorAvailableForLocation(vendor, locationQuery),
  );
}

export function filterItemsByVendorLocation(
  items,
  locationQuery,
  getVendor = (item) => item?.vendor ?? null,
) {
  return items.filter((item) => {
    const vendor = getVendor(item);

    return vendor ? isVendorAvailableForLocation(vendor, locationQuery) : true;
  });
}

export function isVendorDeliverySlotAvailable(vendor, date, time) {
  if (date && !time) {
    return getConfiguredDeliverySlotsForDate(vendor, date).some(
      (slot) => Boolean(getLeadTimeAdjustedSlot(slot, vendor, date)),
    );
  }
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;

  if (isVendorClosedOnDate(matchedVendor, date)) {
    return false;
  }

  if (time && !satisfiesMinimumOrderNotice(matchedVendor, date, time)) {
    return false;
  }

  if (!deliverySchedule) {
    return true;
  }

  const hasConfiguredDays = Array.isArray(deliverySchedule.days) && deliverySchedule.days.length > 0;
  const hasConfiguredSlots =
    Array.isArray(deliverySchedule.slots) && deliverySchedule.slots.length > 0;
  const hasConfiguredRange =
    `${deliverySchedule.start ?? ""}`.trim() && `${deliverySchedule.end ?? ""}`.trim();
  const normalizedScheduleDays = Array.isArray(deliverySchedule.days)
    ? deliverySchedule.days
        .map((day) => normalizeScheduleDayIndex(day))
        .filter((day) => day !== null)
    : [];

  const selectedDate = normalizeSelectedDate(date);
  if (selectedDate && normalizedScheduleDays.length === 0) {
    return false;
  }

  if (time && !hasConfiguredSlots && !hasConfiguredRange) {
    return false;
  }

  const matchesDay = selectedDate
    ? normalizedScheduleDays.includes(selectedDate.getDay())
    : true;

  let matchesTime = true;
  if (time) {
    if (hasConfiguredSlots) {
      const selectedDayCode = getSelectedDayCode(date);
      matchesTime = deliverySchedule.slots.some(
        (slot) => {
          const slotDay = normalizeSlotDay(slot?.day);
          const matchesSlotDay = selectedDayCode ? !slotDay || slotDay === selectedDayCode : true;
          return matchesSlotDay && time >= slot.start && time <= slot.end;
        },
      );
    } else if (hasConfiguredRange) {
      matchesTime =
        time >= deliverySchedule.start && time <= deliverySchedule.end;
    } else {
      matchesTime = false;
    }
  }

  return matchesDay && matchesTime;
}

export function filterVendorsByDeliverySlot(vendors, date, time) {
  if (!date && !time) {
    return vendors;
  }

  return vendors.filter((vendor) =>
    isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

export function getAvailableVendorsForSlot(
  vendors,
  date,
  time,
  excludedVendorSlug,
) {
  return (vendors ?? []).filter(
    (vendor) =>
      vendor.slug !== excludedVendorSlug &&
      isVendorDeliverySlotAvailable(vendor, date, time),
  );
}

export function getConfiguredDeliverySlotsForDate(vendor, date) {
  const matchedVendor = resolveVendorReference(vendor);
  const deliverySchedule =
    vendor?.availability?.delivery ?? matchedVendor?.availability?.delivery;
  const selectedDate = normalizeSelectedDate(date);

  if (!deliverySchedule || !selectedDate) {
    return [];
  }

  if (isVendorClosedOnDate(matchedVendor, selectedDate)) {
    return [];
  }

  const normalizedScheduleDays = Array.isArray(deliverySchedule.days)
    ? deliverySchedule.days
        .map((day) => normalizeScheduleDayIndex(day))
        .filter((day) => day !== null)
    : [];
  const hasMatchingDay = normalizedScheduleDays.includes(selectedDate.getDay());

  if (!hasMatchingDay) {
    return [];
  }

  const configuredSlots = Array.isArray(deliverySchedule.slots)
    ? deliverySchedule.slots
    : [];
  const selectedDayCode = getSelectedDayCode(date);

  return configuredSlots
    .filter((slot) => {
      const slotDay = normalizeSlotDay(slot?.day);
      return (
        `${slot?.start ?? ""}`.trim() &&
        `${slot?.end ?? ""}`.trim() &&
        (!slotDay || slotDay === selectedDayCode)
      );
    })
    .map((slot) => ({
      start: slot.start,
      end: slot.end,
      label: createSlotLabel(slot.start, slot.end),
      isFullyBooked: false,
      remainingCapacity: 9999,
    }));
}

export function filterDeliverySlotsForDate(slots, vendor, date) {
  const normalizedSlots = Array.isArray(slots) ? slots : [];

  if (normalizedSlots.length === 0) {
    return [];
  }

  if (isVendorClosedOnDate(vendor, date)) {
    return [];
  }

  const configuredSlots = getConfiguredDeliverySlotsForDate(vendor, date);

  if (configuredSlots.length === 0) {
    return [];
  }

  const allowedRanges = new Set(
    configuredSlots.map((slot) => `${slot.start}-${slot.end}`),
  );

  const seenRanges = new Set();

  return normalizedSlots
    .map((slot) => {
      const rangeKey = `${slot?.start ?? ""}-${slot?.end ?? ""}`;

      if (!allowedRanges.has(rangeKey) || seenRanges.has(rangeKey)) {
        return null;
      }

      seenRanges.add(rangeKey);
      return getLeadTimeAdjustedSlot(slot, vendor, date);
    })
    .filter(Boolean)
    .map((slot) => ({
      ...slot,
      label: createSlotLabel(slot.start, slot.end),
    }));
}
