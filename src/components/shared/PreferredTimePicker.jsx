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

function buildMinuteOptions(selectedHour, minimumTime) {
  if (!selectedHour) {
    return MINUTE_OPTIONS;
  }

  const selectedHourNumber = Number.parseInt(selectedHour, 10);
  if (!Number.isFinite(selectedHourNumber)) {
    return MINUTE_OPTIONS;
  }

  if (selectedHourNumber !== minimumTime.hour) {
    return MINUTE_OPTIONS;
  }

  return MINUTE_OPTIONS.filter(
    (minute) => Number.parseInt(minute, 10) >= minimumTime.minute,
  );
}

function WheelColumn({ label, options, selectedValue, onSelect, isDisabled }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[#a19084]">
        {label}
      </span>
      <div className="h-40 overflow-y-auto rounded-[14px] bg-[#fffaf6] p-1">
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
  placeholder = "Select time",
  selectedDate = null,
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
  const selectedParts = useMemo(() => parseTimeValue(value), [value]);
  const hourOptions = useMemo(
    () => buildHourOptions(),
    [],
  );
  const validSelectedHour = hourOptions.includes(selectedParts.hour)
    ? selectedParts.hour
    : "";
  const minuteOptions = useMemo(
    () => buildMinuteOptions(validSelectedHour, minimumTime),
    [minimumTime, validSelectedHour],
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
    const allowedMinutes = buildMinuteOptions(draftHour, minimumTime);
    if (!allowedMinutes.includes(draftMinute)) {
      setDraftMinute(allowedMinutes[0] || "");
    }
  }, [draftHour, draftMinute, minimumTime]);

  const draftMinuteOptions = useMemo(
    () => buildMinuteOptions(draftHour, minimumTime),
    [draftHour, minimumTime],
  );
  const canSave = Boolean(draftHour && draftMinute);

  function isHourDisabled(option) {
    const optionHour = Number.parseInt(option, 10);
    if (!Number.isFinite(optionHour)) {
      return true;
    }

    return optionHour < minimumTime.hour || minimumTime.hour >= 24;
  }

  function handleOpen() {
    const nextHour = validSelectedHour || hourOptions.find((option) => !isHourDisabled(option)) || "";
    const nextMinuteOptions = buildMinuteOptions(nextHour, minimumTime);
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

    if (!isTodayDate(normalizedSelectedDate)) {
      return true;
    }

    if (hourNumber < minimumTime.hour) {
      return false;
    }

    if (hourNumber === minimumTime.hour && minuteNumber < minimumTime.minute) {
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

    onChange(buildTimeValue(draftHour, draftMinute));
    setIsOpen(false);
  }

  function handleCancel() {
    setDraftHour(validSelectedHour);
    setDraftMinute(validSelectedMinute);
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
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={commitManualValue}
          placeholder={placeholder}
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
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[260px] rounded-[18px] border border-[#e7ddd3] bg-white p-3 shadow-[0_20px_45px_rgba(44,30,16,0.14)]">
          <div className="mb-3 text-center text-[13px] font-semibold text-[#6f6258]">
            Select time
          </div>

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
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-[10px] px-3 py-2 text-[13px] font-semibold text-[#6f6258] transition hover:bg-[#faf4ef]"
            >
              Cancel
            </button>
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
