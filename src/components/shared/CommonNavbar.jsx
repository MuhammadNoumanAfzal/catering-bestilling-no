import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiHome } from "react-icons/fi";
import CommonNavbarActions from "./navbar/CommonNavbarActions";
import CommonNavbarFilters from "./navbar/CommonNavbarFilters";
import { formatNavbarDate } from "./navbar/navbarDateUtils";
import useUserNotifications from "./navbar/useUserNotifications";
import useNavbarCartSummary from "./navbar/useNavbarCartSummary";
import { useAuth } from "../../features/auth";
import { vendorNavigationItems } from "../../features/vendorDashboard/data/vendorDashboardConfig";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";
import { confirmLogout, showSuccessToast } from "../../utils/alerts";

const commonProfileMenuItems = [
  { label: "Home", to: "/", icon: FiHome },
  { label: "Dashboard", to: "/vendor-dashboard", icon: FiGrid },
  ...vendorNavigationItems.filter((item) => item.to !== "/vendor-dashboard"),
];

const DEFAULT_SEARCH_ROUTE = "/vendors/popular";
const DEFAULT_FILTER_ROUTE = "/";

function resolveNavbarSearchRoute(pathname) {
  if (pathname.startsWith("/browse/food-type")) {
    return "/browse/food-type";
  }

  if (pathname.startsWith("/browse/occasion")) {
    return "/browse/occasion";
  }

  if (pathname.startsWith("/vendors/featured")) {
    return "/vendors/featured";
  }

  if (pathname.startsWith("/vendors/popular")) {
    return "/vendors/popular";
  }

  if (pathname.startsWith("/products/popular")) {
    return "/products/popular";
  }

  return DEFAULT_SEARCH_ROUTE;
}

function shouldPreserveSearchParams(pathname) {
  return (
    pathname.startsWith("/browse/food-type") ||
    pathname.startsWith("/browse/occasion") ||
    pathname.startsWith("/vendors/featured") ||
    pathname.startsWith("/vendors/popular") ||
    pathname.startsWith("/products/popular")
  );
}

function resolveNavbarFilterRoute(pathname) {
  if (
    pathname === "/" ||
    pathname.startsWith("/browse/food-type") ||
    pathname.startsWith("/browse/occasion") ||
    pathname.startsWith("/vendors/featured") ||
    pathname.startsWith("/vendors/popular") ||
    pathname.startsWith("/products/popular")
  ) {
    return pathname;
  }

  return DEFAULT_FILTER_ROUTE;
}

function formatEventLabel(attendeeCount, eventName) {
  if (eventName) {
    return eventName;
  }

  if (attendeeCount > 0) {
    return `${attendeeCount} attendees`;
  }

  return "Event details";
}

function normalizeAttendeeCount(value) {
  if (`${value}`.trim() === "") {
    return 0;
  }

  const parsedValue = Number.parseInt(`${value}`, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function formatAttendeeInputValue(value) {
  return value > 0 ? `${value}` : "";
}

export default function CommonNavbar({
  hideLogo = false,
  className = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, signOut } = useAuth();
  const {
    attendeeCount,
    deliveryDate,
    deliveryTime,
    locationValue,
    eventName,
    searchQuery,
    setAttendeeCount,
    setDeliveryDate,
    setDeliveryTime,
    setEventName,
    setLocationValue,
    setSearchQuery,
  } = useBrowseFilters();
  const { itemCount: cartItemCount } = useNavbarCartSummary();
  const {
    acknowledgeFreshNotifications,
    hasFreshNotification,
    notifications,
    unreadNotificationCount,
  } =
    useUserNotifications();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(null);
  const [draftTime, setDraftTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [draftAttendeeCount, setDraftAttendeeCount] = useState(0);
  const [draftAttendeeInput, setDraftAttendeeInput] = useState("");
  const [draftEventName, setDraftEventName] = useState("");
  const [draftLocation, setDraftLocation] = useState(locationValue);
  const [draftSearch, setDraftSearch] = useState(searchQuery);

  useEffect(() => {
    setDraftLocation(locationValue);
  }, [locationValue]);

  useEffect(() => {
    setDraftSearch(searchQuery);
  }, [searchQuery]);

  const dropdownRef = useRef(null);
  const actionMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((current) => {
      const nextDropdown = current === key ? null : key;

      if (nextDropdown === "delivery") {
        const nextDate = deliveryDate ?? null;
        const monthSource = nextDate ?? new Date();
        setDraftDate(nextDate);
        setDraftTime(deliveryTime);
        setCalendarMonth(
          new Date(monthSource.getFullYear(), monthSource.getMonth(), 1),
        );
      }

      if (nextDropdown === "event") {
        setDraftAttendeeCount(attendeeCount);
        setDraftAttendeeInput(formatAttendeeInputValue(attendeeCount));
        setDraftEventName(eventName);
      }

      return nextDropdown;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpenDropdown(null);
      }

      if (!actionMenuRef.current?.contains(event.target)) {
        setIsActionMenuOpen(false);
      }

      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deliveryLabel = formatNavbarDate(deliveryDate, deliveryTime);
  const eventLabel = formatEventLabel(attendeeCount, eventName);
  const hasDeliverySelection = Boolean(deliveryDate || deliveryTime);
  const hasEventSelection = Boolean(attendeeCount > 0 || eventName.trim());

  const applyDeliverySelection = () => {
    setDeliveryDate(draftDate);
    setDeliveryTime(draftTime);
    setOpenDropdown(null);
    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname) ? location.search : "",
    });
  };

  const applyEventDetails = () => {
    setAttendeeCount(draftAttendeeCount);
    setEventName(draftEventName.trim());
    setOpenDropdown(null);
    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname) ? location.search : "",
    });
  };

  const clearDeliverySelection = () => {
    setDraftDate(null);
    setDraftTime("");
    setDeliveryDate(null);
    setDeliveryTime("");
    setOpenDropdown(null);
    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname) ? location.search : "",
    });
  };

  const clearEventDetails = () => {
    setDraftAttendeeCount(0);
    setDraftAttendeeInput("");
    setDraftEventName("");
    setAttendeeCount(0);
    setEventName("");
    setOpenDropdown(null);
    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname) ? location.search : "",
    });
  };

  const handleSearchSubmit = () => {
    setLocationValue(draftLocation);
    setSearchQuery(draftSearch);

    const nextPathname = resolveNavbarSearchRoute(location.pathname);

    navigate({
      pathname: nextPathname,
      search: shouldPreserveSearchParams(location.pathname) ? location.search : "",
    });
  };

  const handleSignOut = async () => {
    const result = await confirmLogout();

    if (!result.isConfirmed) {
      return;
    }

    await signOut();
    setIsActionMenuOpen(false);
    await showSuccessToast("Logged out successfully");
  };

  const headerClasses = `sticky top-0 z-40 bg-white px-6 py-2 md:px-10 ${className}`.trim();
  const innerClasses = hideLogo
    ? "grid w-full grid-cols-[1fr_auto] items-center gap-3 px-2 py-2"
    : "grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-2";

  return (
    <header className={headerClasses}>
      <div className={innerClasses}>
        {!hideLogo ? (
          <Link to="/" className="flex shrink-0 items-center self-center">
            <img
              src="/home/logo.png"
              alt="Lunsjavtale"
              className="h-14 w-auto object-contain"
            />
          </Link>
        ) : null}

        <div className="hidden min-w-0 items-center justify-self-center lg:flex">
          <div ref={dropdownRef}>
            <CommonNavbarFilters
              calendarMonth={calendarMonth}
              deliveryLabel={deliveryLabel}
              draftAttendeeCount={draftAttendeeCount}
              draftAttendeeInput={draftAttendeeInput}
              draftDate={draftDate}
              draftEventName={draftEventName}
              draftTime={draftTime}
              eventLabel={eventLabel}
              hasDeliverySelection={hasDeliverySelection}
              hasEventSelection={hasEventSelection}
              locationValue={draftLocation}
              onApplyDelivery={applyDeliverySelection}
              onApplyEvent={applyEventDetails}
              onClearDelivery={clearDeliverySelection}
              onClearEvent={clearEventDetails}
              onAttendeeChange={(change) =>
                setDraftAttendeeCount((current) => {
                  const nextValue = Math.max(0, current + change);
                  setDraftAttendeeInput(formatAttendeeInputValue(nextValue));
                  return nextValue;
                })
              }
              onAttendeeInputChange={(value) => {
                setDraftAttendeeInput(value);
                setDraftAttendeeCount(normalizeAttendeeCount(value));
              }}
              onDateSelect={setDraftDate}
              onEventNameChange={setDraftEventName}
              onLocationChange={setDraftLocation}
              onLocationClear={() => {
                setDraftLocation("");
                setLocationValue("");
              }}
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
              onSearchChange={setDraftSearch}
              onSearchSubmit={handleSearchSubmit}
              onTimeSelect={setDraftTime}
              openDropdown={openDropdown}
              searchValue={draftSearch}
              setSearchValue={(val) => {
                setDraftSearch(val);
                if (val === "") {
                  setSearchQuery("");
                }
              }}
              toggleDropdown={toggleDropdown}
            />
          </div>
        </div>

        <CommonNavbarActions
          actionMenuRef={actionMenuRef}
          cartItemCount={cartItemCount}
          hasFreshNotification={hasFreshNotification}
          isActionMenuOpen={isActionMenuOpen}
          isLoggedIn={isLoggedIn}
          isNotificationOpen={isNotificationOpen}
          menuItems={commonProfileMenuItems}
          notifications={notifications}
          notificationRef={notificationRef}
          onCheckoutClick={() => {
            setIsActionMenuOpen(false);
            setIsNotificationOpen(false);
            navigate("/checkout/corporate");
          }}
          onCloseActionMenu={() => setIsActionMenuOpen(false)}
          onNotificationToggle={() => {
            setIsNotificationOpen((current) => {
              const nextValue = !current;

              if (nextValue) {
                acknowledgeFreshNotifications();
              }

              return nextValue;
            });
            setIsActionMenuOpen(false);
          }}
          onSignOut={handleSignOut}
          onToggleActionMenu={() => {
            setIsActionMenuOpen((current) => !current);
            setIsNotificationOpen(false);
          }}
          unreadNotificationCount={unreadNotificationCount}
          user={user}
        />
      </div>
    </header>
  );
}
