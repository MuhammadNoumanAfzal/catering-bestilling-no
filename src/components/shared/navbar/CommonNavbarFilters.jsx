import {
  FiCalendar,
  FiChevronDown,
  FiMapPin,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DeliveryDatePopover from "./DeliveryDatePopover";
import EventDetailsPopover from "./EventDetailsPopover";

export default function CommonNavbarFilters({
  calendarMonth,
  deliveryLabel,
  draftAttendeeCount,
  draftDate,
  draftEventName,
  draftTime,
  eventLabel,
  hasDeliverySelection,
  hasEventSelection,
  locationValue,
  onApplyDelivery,
  onApplyEvent,
  onAttendeeChange,
  onDateSelect,
  onEventNameChange,
  onLocationChange,
  onMonthChange,
  onSearchChange,
  onSearchSubmit,
  onTimeSelect,
  openDropdown,
  searchValue,
  setSearchValue,
  toggleDropdown,
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative ">
        <div className="flex h-8 items-center overflow-hidden rounded-full border border-[#d9d1c7] bg-white px-2 ">
          <label className="type-subpara flex h-full items-center gap-1.5 font-semibold text-[#434343]">
            <FiMapPin
              className={`text-[14px] ${
                locationValue.trim() ? "text-[#CF3A00]" : "text-[#8f8f8f]"
              }`}
            />
            <input
              type="text"
              value={locationValue}
              onChange={(event) => onLocationChange(event.target.value)}
              placeholder="Enter location"
              className="w-[150px] bg-transparent text-[16px] text-[#434343] outline-none placeholder:text-[#a7a099]"
            />
          </label>

          <div className="h-4  w-px bg-[#e3ddd6]" />

          <button
            type="button"
            onClick={() => toggleDropdown("delivery")}
            className={`type-subpara flex h-full min-w-[185px] cursor-pointer items-center justify-between gap-3 px-3 font-semibold transition ${
              openDropdown === "delivery" || hasDeliverySelection
                ? "text-[#CF3A00]"
                : "text-[#5d5d5d]"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FiCalendar
                className={`text-[14px] ${
                  openDropdown === "delivery" || hasDeliverySelection
                    ? "text-[#CF3A00]"
                    : "text-[#8f8f8f]"
                }`}
              />
              <span className="text-[16px]">{deliveryLabel}</span>
            </span>
            <FiChevronDown
              className={`shrink-0 text-[10px] ${
                openDropdown === "delivery" || hasDeliverySelection
                  ? "text-[#CF3A00]"
                  : "text-[#8f8f8f]"
              }`}
            />
          </button>

          <div className="h-4 w-px bg-[#e3ddd6]" />

          <button
            type="button"
            onClick={() => toggleDropdown("event")}
            className={`type-subpara flex h-full min-w-[165px] cursor-pointer items-center justify-between gap-3 px-3 font-semibold transition ${
              openDropdown === "event" || hasEventSelection
                ? "text-[#CF3A00]"
                : "text-[#5d5d5d]"
            }`}
          >
            <span className="text-[16px]">{eventLabel}</span>
            <FiChevronDown
              className={`shrink-0 text-[10px] ${
                openDropdown === "event" || hasEventSelection
                  ? "text-[#CF3A00]"
                  : "text-[#8f8f8f]"
              }`}
            />
          </button>
        </div>

        {openDropdown === "delivery" ? (
          <DeliveryDatePopover
            calendarMonth={calendarMonth}
            draftDate={draftDate}
            draftTime={draftTime}
            onApply={onApplyDelivery}
            onDateSelect={onDateSelect}
            onMonthChange={onMonthChange}
            onTimeSelect={onTimeSelect}
          />
        ) : null}

        {openDropdown === "event" ? (
          <EventDetailsPopover
            attendeeCount={draftAttendeeCount}
            eventName={draftEventName}
            onApply={onApplyEvent}
            onAttendeeChange={onAttendeeChange}
            onEventNameChange={onEventNameChange}
          />
        ) : null}
      </div>

      <div className="flex h-8 w-full max-w-[220px] items-center rounded-full border border-[#ddd6cd] bg-white pl-3 pr-1">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSearchSubmit?.();
            }
          }}
          placeholder="Search restaurant..."
          className="text-[10px] w-full bg-transparent text-[#5c5c5c] outline-none placeholder:text-[#b8b1a9]"
        />

        {searchValue ? (
          <button
            type="button"
            onClick={() => setSearchValue("")}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#a7a099]"
            aria-label="Clear search"
          >
            <FiX className="text-[11px]" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={onSearchSubmit}
          className="ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c85f33] text-white"
          aria-label="Search"
        >
          <FiSearch className="text-[16px]" />
        </button>
      </div>
    </div>
  );
}
