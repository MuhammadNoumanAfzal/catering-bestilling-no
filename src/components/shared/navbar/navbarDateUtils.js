export const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function getMonthDays(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];

  for (let index = 0; index < firstDayIndex; index += 1) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    calendarDays.push(new Date(year, month, day));
  }

  return calendarDays;
}

export function isSameDay(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return false;
  }

  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

export function formatTimeTo12Hour(time) {
  if (!time) {
    return "";
  }

  const [rawHours = "0", rawMinutes = "00"] = `${time}`.split(":");
  const hours = Number(rawHours);

  if (Number.isNaN(hours)) {
    return `${time}`;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;

  return `${normalizedHours}:${rawMinutes} ${suffix}`;
}

export function formatNavbarDate(date, time) {
  if (!date && !time) {
    return "Any time";
  }

  const dateLabel = date
    ? date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Any day";

  return time ? `${dateLabel}, ${formatTimeTo12Hour(time)}` : dateLabel;
}
