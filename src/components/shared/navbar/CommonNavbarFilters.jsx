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
  dropdownOptions,
  eventLabel,
  hasDeliverySelection,
  hasEventSelection,
  handleSelect,
  onApplyDelivery,
  onApplyEvent,
  onAttendeeChange,
  onDateSelect,
  onEventNameChange,
  onMonthChange,
  onSearchChange,
  onTimeSelect,
  openDropdown,
  searchValue,
  selectedFilters,
  setSearchValue,
  toggleDropdown,
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative ">
        <div className="flex h-8 items-center overflow-hidden rounded-full border border-[#d9d1c7] bg-white px-2 ">
          <button
            type="button"
            onClick={() => toggleDropdown("city")}
            className={`type-subpara flex h-full cursor-pointer items-center gap-1.5 font-semibold transition ${
              openDropdown === "city" || selectedFilters.city !== "Bergen"
                ? "text-[#CF3A00]"
                : "text-[#434343]"
            }`}
          >
            <FiMapPin
              className={`text-[14px] ${
                openDropdown === "city" || selectedFilters.city !== "Bergen"
                  ? "text-[#CF3A00]"
                  : "text-[#8f8f8f]"
              }`}
            />
            <span className="text-[16px]">{selectedFilters.city}</span>
            <FiChevronDown
              className={`pl-14 text-[10px] ${
                openDropdown === "city" || selectedFilters.city !== "Bergen"
                  ? "text-[#CF3A00]"
                  : "text-[#8f8f8f]"
              }`}
            />
          </button>

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

        {openDropdown &&
        openDropdown !== "delivery" &&
        openDropdown !== "event" ? (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 min-w-[220px] rounded-2xl border border-[#ece7df] bg-white p-2 shadow-lg">
            {dropdownOptions[openDropdown].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(openDropdown, option)}
                className="type-subpara flex w-full rounded-xl px-3 py-2 text-left text-[#4f4f4f] transition hover:bg-[#f7f2ec]"
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex h-8 w-full max-w-[220px] items-center rounded-full border border-[#ddd6cd] bg-white pl-3 pr-1">
        <input
          type="text"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
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
          className="ml-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#c85f33] text-white"
          aria-label="Search"
        >
          <FiSearch className="text-[16px]" />
        </button>
      </div>
    </div>
  );
}
