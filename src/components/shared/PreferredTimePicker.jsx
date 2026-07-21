import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiClock } from "react-icons/fi";

const MINUTE_OPTIONS = ["00", "15", "30", "45"];

function normalizeDateValue(selectedDate) {
  if (!selectedDate) {
    return null;
  }

  if (selectedDate instanceof Date) {
    return Number.isNaN(selectedDate.getTime()) ? null : selectedDate;
  }

  const normalizedValue = `${selectedDate}`.trim();
  if (!normalizedValue) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    const [year, month, day] = normalizedValue.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(normalizedValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isTodayDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function parseTimeValue(timeValue) {
  const match = `${timeValue ?? ""}`.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return { hour: "", minute: "" };
  }

  return {
    hour: String(Number.parseInt(match[1], 10)).padStart(2, "0"),
    minute: match[2],
  };
}

function buildTimeValue(hour, minute) {
  if (!hour || !minute) {
    return "";
  }

  return `${hour}:${minute}`;
}

function compareTimeValues(leftTime, rightTime) {
  if (!leftTime || !rightTime) {
    return 0;
  }

  const leftParts = parseTimeValue(leftTime);
  const rightParts = parseTimeValue(rightTime);

  if (!leftParts.hour || !leftParts.minute || !rightParts.hour || !rightParts.minute) {
    return 0;
  }

  return buildTimeValue(leftParts.hour, leftParts.minute)
    .localeCompare(buildTimeValue(rightParts.hour, rightParts.minute));
}

function getMinimumSelectableTime(selectedDate) {
  if (!isTodayDate(selectedDate)) {
    return { hour: 0, minute: 0 };
  }

  const now = new Date();
  let nextHour = now.getHours();
  let nextMinute = Math.ceil(now.getMinutes() / 15) * 15;

  if (nextMinute >= 60) {
    nextHour += 1;
    nextMinute = 0;
  }

  if (nextHour >= 24) {
    return { hour: 24, minute: 0 };
  }

  return { hour: nextHour, minute: nextMinute };
}

function buildHourOptions() {
  return Array.from({ length: 24 }, (_, index) =>
    String(index).padStart(2, "0"),
  );
}

function buildMinuteOptions(selectedHour, minimumTime, maximumTime = null) {
  if (!selectedHour) {
    return MINUTE_OPTIONS;
  }

  const selectedHourNumber = Number.parseInt(selectedHour, 10);
  if (!Number.isFinite(selectedHourNumber)) {
    return MINUTE_OPTIONS;
  }

  return MINUTE_OPTIONS.filter((minute) => {
    const minuteNumber = Number.parseInt(minute, 10);

    if (selectedHourNumber === minimumTime.hour && minuteNumber < minimumTime.minute) {
      return false;
    }

    if (
      maximumTime &&
      selectedHourNumber === maximumTime.hour &&
      minuteNumber > maximumTime.minute
    ) {
      return false;
    }

    return true;
  });
}

function formatTimeLabel(timeValue) {
  const parts = parseTimeValue(timeValue);
  if (!parts.hour || !parts.minute) {
    return "";
  }

  return `${parts.hour}:${parts.minute}`;
}

function buildQuickTimeOptions(minimumTime, maximumTime = null) {
  const options = [];
  const startHour = minimumTime.hour >= 24 ? 24 : minimumTime.hour;
  let hour = startHour;
  let minute = minimumTime.minute || 0;
  const maxComparable = maximumTime
    ? buildTimeValue(
      String(maximumTime.hour).padStart(2, "0"),
      String(maximumTime.minute).padStart(2, "0"),
    )
    : "";

  while (minute % 30 !== 0 && hour < 24) {
    minute += 15;
    if (minute >= 60) {
      hour += 1;
      minute = 0;
    }
  }

  while (hour < 24 && options.length < 5) {
    const nextValue = buildTimeValue(
      String(hour).padStart(2, "0"),
      String(minute).padStart(2, "0"),
    );

    if (maximumTime && compareTimeValues(nextValue, maxComparable) > 0) {
      break;
    }

    options.push(nextValue);
    minute += 60;
    if (minute >= 60) {
      hour += Math.floor(minute / 60);
      minute %= 60;
    }
  }

  return options.filter(Boolean);
}

function WheelColumn({ label, options, selectedValue, onSelect, isDisabled }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#a19084]">
        {label}
      </span>
      <div className="h-32 overflow-y-auto rounded-[14px] bg-[#fffaf6] p-1">
        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = selectedValue === option;
            const disabled = Boolean(isDisabled?.(option));

            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (!disabled) {
                    onSelect(option);
                  }
                }}
                disabled={disabled}
                className={`flex h-9 w-full items-center justify-center rounded-[10px] text-[16px] font-semibold transition ${
                  isSelected
                    ? "bg-white text-[#1d1713] shadow-[0_3px_10px_rgba(44,30,16,0.08)]"
                    : disabled
                      ? "cursor-not-allowed text-[#ddd2c8]"
                      : "text-[#b8aca1] hover:text-[#6b5f55]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PreferredTimePicker({
  value,
  onChange,
  placeholder = "HH:MM",
  selectedDate = null,
  minTimeValue = "",
  maxTimeValue = "",
}) {
  const wrapperRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || "");
  const normalizedSelectedDate = useMemo(
    () => normalizeDateValue(selectedDate),
    [selectedDate],
  );
  const minimumTime = useMemo(
    () => getMinimumSelectableTime(normalizedSelectedDate),
    [normalizedSelectedDate],
  );
  const minimumSlotTime = useMemo(
    () => parseTimeValue(minTimeValue),
    [minTimeValue],
  );
  const maximumSlotTime = useMemo(
    () => parseTimeValue(maxTimeValue),
    [maxTimeValue],
  );
  const effectiveMinimumTime = useMemo(() => {
    const dateMinimumValue = buildTimeValue(
      String(minimumTime.hour).padStart(2, "0"),
      String(minimumTime.minute).padStart(2, "0"),
    );

    if (
      minimumSlotTime.hour &&
      minimumSlotTime.minute &&
      compareTimeValues(minTimeValue, dateMinimumValue) > 0
    ) {
      return {
        hour: Number.parseInt(minimumSlotTime.hour, 10),
        minute: Number.parseInt(minimumSlotTime.minute, 10),
      };
    }

    return minimumTime;
  }, [minTimeValue, minimumSlotTime.hour, minimumSlotTime.minute, minimumTime]);
  const effectiveMaximumTime = useMemo(() => {
    if (!maximumSlotTime.hour || !maximumSlotTime.minute) {
      return null;
    }

    return {
      hour: Number.parseInt(maximumSlotTime.hour, 10),
      minute: Number.parseInt(maximumSlotTime.minute, 10),
    };
  }, [maximumSlotTime.hour, maximumSlotTime.minute]);
  const selectedParts = useMemo(() => parseTimeValue(value), [value]);
  const hourOptions = useMemo(
    () => buildHourOptions(),
    [],
  );
  const validSelectedHour = hourOptions.includes(selectedParts.hour)
    ? selectedParts.hour
    : "";
  const minuteOptions = useMemo(
    () => buildMinuteOptions(validSelectedHour, effectiveMinimumTime, effectiveMaximumTime),
    [effectiveMaximumTime, effectiveMinimumTime, validSelectedHour],
  );
  const validSelectedMinute = minuteOptions.includes(selectedParts.minute)
    ? selectedParts.minute
    : minuteOptions[0] || "";
  const [isOpen, setIsOpen] = useState(false);
  const [draftHour, setDraftHour] = useState(validSelectedHour || hourOptions[0] || "");
  const [draftMinute, setDraftMinute] = useState(validSelectedMinute || minuteOptions[0] || "");

  useEffect(() => {
    if (!value) {
      return;
    }

    const nextValue = buildTimeValue(validSelectedHour, validSelectedMinute);
    if ((!validSelectedHour || !validSelectedMinute) && value) {
      onChange("");
      return;
    }

    if (nextValue && nextValue !== value) {
      onChange(nextValue);
    }
  }, [onChange, validSelectedHour, validSelectedMinute, value]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (!isOpen) {
      setDraftHour(validSelectedHour || hourOptions[0] || "");
      setDraftMinute(validSelectedMinute || minuteOptions[0] || "");
    }
  }, [hourOptions, isOpen, minuteOptions, validSelectedHour, validSelectedMinute]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const allowedMinutes = buildMinuteOptions(
      draftHour,
      effectiveMinimumTime,
      effectiveMaximumTime,
    );
    if (!allowedMinutes.includes(draftMinute)) {
      setDraftMinute(allowedMinutes[0] || "");
    }
  }, [draftHour, draftMinute, effectiveMaximumTime, effectiveMinimumTime]);

  const draftMinuteOptions = useMemo(
    () => buildMinuteOptions(draftHour, effectiveMinimumTime, effectiveMaximumTime),
    [draftHour, effectiveMaximumTime, effectiveMinimumTime],
  );
  const quickTimeOptions = useMemo(
    () => buildQuickTimeOptions(effectiveMinimumTime, effectiveMaximumTime),
    [effectiveMaximumTime, effectiveMinimumTime],
  );
  const canSave = Boolean(draftHour && draftMinute);

  function isHourDisabled(option) {
    const optionHour = Number.parseInt(option, 10);
    if (!Number.isFinite(optionHour)) {
      return true;
    }

    if (effectiveMinimumTime.hour >= 24) {
      return true;
    }

    if (optionHour < effectiveMinimumTime.hour) {
      return true;
    }

    if (effectiveMaximumTime && optionHour > effectiveMaximumTime.hour) {
      return true;
    }

    return false;
  }

  function handleOpen() {
    const nextHour = validSelectedHour || hourOptions.find((option) => !isHourDisabled(option)) || "";
    const nextMinuteOptions = buildMinuteOptions(
      nextHour,
      effectiveMinimumTime,
      effectiveMaximumTime,
    );
    const nextMinute = validSelectedMinute || nextMinuteOptions[0] || "";

    setDraftHour(nextHour);
    setDraftMinute(nextMinute);
    setIsOpen(true);
  }

  function normalizeManualTime(rawValue) {
    const normalized = `${rawValue ?? ""}`.trim();
    if (!normalized) {
      return "";
    }

    const directMatch = normalized.match(/^(\d{1,2}):(\d{2})$/);
    if (directMatch) {
      const hours = Number.parseInt(directMatch[1], 10);
      const minutes = Number.parseInt(directMatch[2], 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    }

    const compactMatch = normalized.match(/^(\d{1,2})(\d{2})$/);
    if (compactMatch) {
      const hours = Number.parseInt(compactMatch[1], 10);
      const minutes = Number.parseInt(compactMatch[2], 10);

      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
      }
    }

    return null;
  }

  function handleInputChange(rawValue) {
    const digitsOnly = `${rawValue ?? ""}`.replace(/[^\d]/g, "").slice(0, 4);

    if (!digitsOnly) {
      setInputValue("");
      return;
    }

    if (digitsOnly.length <= 2) {
      setInputValue(digitsOnly);
      return;
    }

    setInputValue(`${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`);
  }

  function isManualTimeAllowed(timeValue) {
    const parts = parseTimeValue(timeValue);
    if (!parts.hour || !parts.minute) {
      return false;
    }

    const hourNumber = Number.parseInt(parts.hour, 10);
    const minuteNumber = Number.parseInt(parts.minute, 10);

    if (!Number.isFinite(hourNumber) || !Number.isFinite(minuteNumber)) {
      return false;
    }

    if (hourNumber < effectiveMinimumTime.hour) {
      return false;
    }

    if (
      hourNumber === effectiveMinimumTime.hour &&
      minuteNumber < effectiveMinimumTime.minute
    ) {
      return false;
    }

    if (effectiveMaximumTime && hourNumber > effectiveMaximumTime.hour) {
      return false;
    }

    if (
      effectiveMaximumTime &&
      hourNumber === effectiveMaximumTime.hour &&
      minuteNumber > effectiveMaximumTime.minute
    ) {
      return false;
    }

    return true;
  }

  function commitManualValue() {
    const normalized = normalizeManualTime(inputValue);

    if (normalized === "") {
      setInputValue("");
      onChange("");
      return;
    }

    if (!normalized || !isManualTimeAllowed(normalized)) {
      setInputValue(value || "");
      return;
    }

    setInputValue(normalized);
    onChange(normalized);
  }

  function handleSave() {
    if (!canSave) {
      return;
    }

    const nextValue = buildTimeValue(draftHour, draftMinute);
    onChange(nextValue);
    setInputValue(nextValue);
    setIsOpen(false);
  }

  function handleCancel() {
    setDraftHour(validSelectedHour);
    setDraftMinute(validSelectedMinute);
    setIsOpen(false);
  }

  function handleClear() {
    setInputValue("");
    onChange("");
    setIsOpen(false);
  }

  function handleQuickPick(timeValue) {
    const parts = parseTimeValue(timeValue);
    if (!parts.hour || !parts.minute) {
      return;
    }

    setDraftHour(parts.hour);
    setDraftMinute(parts.minute);
    setInputValue(timeValue);
    onChange(timeValue);
    setIsOpen(false);
  }

  const displayValue = value || "";

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex h-10 w-full items-center rounded-[12px] border border-[#d7cdc4] bg-[linear-gradient(180deg,#fffdfb_0%,#fff7f2_100%)] pl-3 shadow-[0_2px_10px_rgba(44,30,16,0.04)] transition focus-within:border-[#cf6e38] hover:border-[#cf6e38]/40">
        <FiClock className="mr-2 shrink-0 text-[14px] text-[#7f746a]" />
        <input
          type="text"
          value={inputValue}
          onChange={(event) => handleInputChange(event.target.value)}
          onBlur={commitManualValue}
          onFocus={() => {
            if (!isOpen) {
              handleOpen();
            }
          }}
          placeholder={placeholder}
          inputMode="numeric"
          maxLength={5}
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#1d1713] outline-none placeholder:text-[#aa9e93]"
        />
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex h-full w-10 items-center justify-center rounded-r-[12px] text-[#8f8175]"
        >
          <FiChevronDown className={`text-[15px] transition ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full min-w-[280px] max-w-[340px] rounded-[18px] border border-[#e7ddd3] bg-white p-3 shadow-[0_20px_45px_rgba(44,30,16,0.14)]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[13px] font-semibold text-[#6f6258]">Select time</div>
              <div className="text-[11px] text-[#a19084]">24-hour format</div>
            </div>
            <div className="rounded-full bg-[#faf4ef] px-3 py-1 text-[12px] font-semibold text-[#cf6e38]">
              {displayValue ? formatTimeLabel(displayValue) : "No time"}
            </div>
          </div>

          {quickTimeOptions.length ? (
            <div className="mb-3">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a19084]">
                Quick pick
              </div>
              <div className="flex flex-wrap gap-2">
                {quickTimeOptions.map((option) => {
                  const isSelected = option === displayValue;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleQuickPick(option)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                        isSelected
                          ? "border-[#cf6e38] bg-[#fff1e8] text-[#cf6e38]"
                          : "border-[#eadfd6] bg-white text-[#6f6258] hover:border-[#cf6e38]/35 hover:bg-[#fff8f4]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="flex items-start gap-2">
            <WheelColumn
              label="Hour"
              options={hourOptions}
              selectedValue={draftHour}
              onSelect={setDraftHour}
              isDisabled={isHourDisabled}
            />
            <WheelColumn
              label="Min"
              options={draftMinuteOptions}
              selectedValue={draftMinute}
              onSelect={setDraftMinute}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {displayValue ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-[10px] px-3 py-2 text-[13px] font-semibold text-[#c85e2f] transition hover:bg-[#fff4ee]"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-[10px] px-3 py-2 text-[13px] font-semibold text-[#6f6258] transition hover:bg-[#faf4ef]"
              >
                Cancel
              </button>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-[10px] border border-[#eadfd6] bg-white px-4 py-2 text-[13px] font-semibold text-[#1d1713] shadow-[0_2px_8px_rgba(44,30,16,0.06)] transition hover:border-[#cf6e38]/30 hover:bg-[#fff8f4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
