export const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function buildQuarterHourSlots(startHour, endHour) {
  const slots = [];

  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (let minutes = 0; minutes < 60; minutes += 15) {
      const date = new Date(2026, 0, 1, hour, minutes);
      slots.push(
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    }
  }

  return slots;
}

export const earlierSlots = buildQuarterHourSlots(9, 12);

export const laterSlots = buildQuarterHourSlots(13, 18);

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

  return time ? `${dateLabel}, ${time}` : dateLabel;
}
