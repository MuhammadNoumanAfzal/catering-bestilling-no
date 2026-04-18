import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronDown,
  FiMapPin,
  FiShoppingCart,
  FiCalendar,
  FiSearch,
  FiX,
} from "react-icons/fi";
import DeliveryDatePopover from "./navbar/DeliveryDatePopover";
import EventDetailsPopover from "./navbar/EventDetailsPopover";
import { formatNavbarDate } from "./navbar/navbarDateUtils";

const dropdownOptions = {
  city: ["Bergen", "Oslo", "Stavanger", "Trondheim"],
};

function formatEventLabel(attendeeCount, eventName) {
  if (eventName) {
    return eventName;
  }

  if (attendeeCount > 0) {
    return `${attendeeCount} attendees`;
  }

  return "Event details";
}

export default function CommonNavbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    city: "Bergen",
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [draftDate, setDraftDate] = useState(new Date());
  const [draftTime, setDraftTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [eventName, setEventName] = useState("");
  const [draftAttendeeCount, setDraftAttendeeCount] = useState(0);
  const [draftEventName, setDraftEventName] = useState("");
  const dropdownRef = useRef(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((current) => {
      const nextDropdown = current === key ? null : key;

      if (nextDropdown === "delivery") {
        const nextDate = selectedDate ?? new Date();
        setDraftDate(nextDate);
        setDraftTime(selectedTime);
        setCalendarMonth(
          new Date(nextDate.getFullYear(), nextDate.getMonth(), 1),
        );
      }

      if (nextDropdown === "event") {
        setDraftAttendeeCount(attendeeCount);
        setDraftEventName(eventName);
      }

      return nextDropdown;
    });
  };

  const handleSelect = (key, value) => {
    setSelectedFilters((current) => ({ ...current, [key]: value }));
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deliveryLabel = formatNavbarDate(selectedDate, selectedTime);
  const eventLabel = formatEventLabel(attendeeCount, eventName);
  const hasDeliverySelection = Boolean(selectedDate || selectedTime);
  const hasEventSelection = Boolean(attendeeCount > 0 || eventName.trim());

  const applyDeliverySelection = () => {
    setSelectedDate(draftDate);
    setSelectedTime(draftTime);
    setOpenDropdown(null);
  };

  const applyEventDetails = () => {
    setAttendeeCount(draftAttendeeCount);
    setEventName(draftEventName.trim());
    setOpenDropdown(null);
  };

  return (
    <header className="sticky top-0 px-10 z-40 bg-white">
      <div className=" grid w-full  grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-1">
        <Link to="/" className="mt-2 shrink-0">
          <img
            src="/home/logo.png"
            alt="Lunsjavtale"
            className="h-18 w-33 object-contain"
          />
        </Link>

        <div className="hidden min-w-0 items-center justify-self-center lg:flex">
          <div className="flex items-center gap-6">
            <div ref={dropdownRef} className="relative ">
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
                  onApply={applyDeliverySelection}
                  onDateSelect={setDraftDate}
                  onMonthChange={(direction) =>
                    setCalendarMonth(
                      (current) =>
                        new Date(
                          current.getFullYear(),
                          current.getMonth() + direction,
                          1,
                        ),
                    )
                  }
                  onTimeSelect={setDraftTime}
                />
              ) : null}

              {openDropdown === "event" ? (
                <EventDetailsPopover
                  attendeeCount={draftAttendeeCount}
                  eventName={draftEventName}
                  onApply={applyEventDetails}
                  onAttendeeChange={(change) =>
                    setDraftAttendeeCount((current) =>
                      Math.max(0, current + change),
                    )
                  }
                  onEventNameChange={setDraftEventName}
                />
              ) : null}

              {openDropdown && openDropdown !== "delivery" && openDropdown !== "event" ? (
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
                onChange={(event) => setSearchValue(event.target.value)}
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
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/"
            className="type-h5 hidden text-[#2f2f2f] transition hover:text-[#c85f33] md:inline-flex"
          >
            Contact us
          </Link>

          <Link
            to="/"
            className="type-h6 rounded-full bg-[#c85f33] px-6 py-2 text-white transition hover:bg-[#b6542c]"
          >
            Sign in
          </Link>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center text-[18px] text-[#2f2f2f] transition hover:text-[#c85f33]"
            aria-label="Cart"
          >
            <div className="text-3xl">
              {" "}
              <FiShoppingCart />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
