import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiHome, FiSettings } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import CommonNavbarActions from "./navbar/CommonNavbarActions";
import CommonNavbarFilters from "./navbar/CommonNavbarFilters";
import { formatNavbarDate, isPastDate } from "./navbar/navbarDateUtils";
import useUserNotifications from "./navbar/useUserNotifications";
import useNavbarCartSummary from "./navbar/useNavbarCartSummary";
import { useAuth } from "../../features/auth";
import { vendorNavigationItems } from "../../features/vendorDashboard/data/vendorDashboardConfig";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";
import { confirmLogout, showSuccessToast } from "../../utils/alerts";

const DEFAULT_SEARCH_ROUTE = "/vendors/all";
const DEFAULT_FILTER_ROUTE = "/";

function isVendorDashboardRoute(pathname) {
  return pathname === "/vendor-dashboard" || pathname.startsWith("/vendor-dashboard/");
}

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

  if (pathname.startsWith("/vendors/all")) {
    return "/vendors/all";
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
    pathname.startsWith("/vendors/all") ||
    pathname.startsWith("/vendors/featured") ||
    pathname.startsWith("/vendors/popular") ||
    pathname.startsWith("/products/popular")
  );
}

function shouldNavigateForNavbarFilters(pathname) {
  return (
    pathname === "/" ||
    isVendorDashboardRoute(pathname) ||
    pathname.startsWith("/browse/food-type") ||
    pathname.startsWith("/browse/occasion") ||
    pathname.startsWith("/vendors/all") ||
    pathname.startsWith("/vendors/featured") ||
    pathname.startsWith("/vendors/popular") ||
    pathname.startsWith("/products/popular")
  );
}

function resolveNavbarFilterRoute(pathname) {
  if (isVendorDashboardRoute(pathname)) {
    return DEFAULT_SEARCH_ROUTE;
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/browse/food-type") ||
    pathname.startsWith("/browse/occasion") ||
    pathname.startsWith("/vendors/all") ||
    pathname.startsWith("/vendors/featured") ||
    pathname.startsWith("/vendors/popular") ||
    pathname.startsWith("/products/popular")
  ) {
    return pathname;
  }

  return DEFAULT_FILTER_ROUTE;
}

function formatEventLabel(attendeeCount, eventName) {
  return "";
}

function buildEventLabel(attendeeCount, eventName, t) {
  if (eventName) {
    return eventName;
  }

  if (attendeeCount > 0) {
    return t("nav.attendees", { count: attendeeCount });
  }

  return t("nav.eventDetails");
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

export default function CommonNavbar({ hideLogo = false, className = "" }) {
  const { t, i18n } = useTranslation();
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
    openNotification,
    readAllNotifications,
    unreadNotificationCount,
  } = useUserNotifications();
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
        const nextDate = isPastDate(deliveryDate)
          ? null
          : (deliveryDate ?? null);
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

  const deliveryLabel = formatNavbarDate(deliveryDate, deliveryTime, {
    anyTime: t("nav.anyTime"),
    anyDay: t("nav.anyDay"),
    locale: i18n.language === "no" ? "nb-NO" : "en-US",
  });
  const eventLabel = buildEventLabel(attendeeCount, eventName, t);
  const hasDeliverySelection = Boolean(deliveryDate || deliveryTime);
  const hasEventSelection = Boolean(attendeeCount > 0 || eventName.trim());
  const commonProfileMenuItems = [
    { label: t("nav.home"), to: "/", icon: FiHome },
    { label: t("nav.settings"), to: "/settings", icon: FiSettings },
    { label: t("nav.dashboard"), to: "/vendor-dashboard", icon: FiGrid },
    ...vendorNavigationItems
      .filter(
        (item) =>
          item.to !== "/vendor-dashboard" &&
          item.to !== "/vendor-dashboard/settings",
      )
      .map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
  ];
  const guestMenuItems = [{ label: t("nav.home"), to: "/", icon: FiHome }];
  const actionMenuItems = isLoggedIn ? commonProfileMenuItems : guestMenuItems;

  const applyDeliverySelection = () => {
    const nextDeliveryDate = isPastDate(draftDate) ? null : draftDate;

    setDeliveryDate(nextDeliveryDate);
    setDeliveryTime(draftTime);
    setOpenDropdown(null);

    if (!shouldNavigateForNavbarFilters(location.pathname)) {
      return;
    }

    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname)
        ? location.search
        : "",
    });
  };

  const applyEventDetails = () => {
    setAttendeeCount(draftAttendeeCount);
    setEventName(draftEventName.trim());
    setOpenDropdown(null);

    if (!shouldNavigateForNavbarFilters(location.pathname)) {
      return;
    }

    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname)
        ? location.search
        : "",
    });
  };

  const clearDeliverySelection = () => {
    setDraftDate(null);
    setDraftTime("");
    setDeliveryDate(null);
    setDeliveryTime("");
    setOpenDropdown(null);

    if (!shouldNavigateForNavbarFilters(location.pathname)) {
      return;
    }

    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname)
        ? location.search
        : "",
    });
  };

  const clearEventDetails = () => {
    setDraftAttendeeCount(0);
    setDraftAttendeeInput("");
    setDraftEventName("");
    setAttendeeCount(0);
    setEventName("");
    setOpenDropdown(null);

    if (!shouldNavigateForNavbarFilters(location.pathname)) {
      return;
    }

    navigate({
      pathname: resolveNavbarFilterRoute(location.pathname),
      search: shouldPreserveSearchParams(location.pathname)
        ? location.search
        : "",
    });
  };

  const handleSearchSubmit = () => {
    setLocationValue(draftLocation);
    setSearchQuery(draftSearch);

    const nextPathname = resolveNavbarSearchRoute(location.pathname);

    navigate({
      pathname: nextPathname,
      search: shouldPreserveSearchParams(location.pathname)
        ? location.search
        : "",
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

  const headerClasses =
    `sticky top-0 z-40 bg-white px-3 py-2 sm:px-4 md:px-6 lg:px-10 ${className}`.trim();
  const innerClasses = hideLogo
    ? "flex w-full items-center justify-between gap-2 py-1.5 sm:gap-3 sm:py-2 lg:grid lg:grid-cols-[1fr_auto]"
    : "flex w-full items-center justify-between gap-2 py-1.5 sm:gap-3 sm:py-2 lg:grid lg:grid-cols-[auto_1fr_auto]";

  return (
    <header className={headerClasses}>
      <div className={innerClasses}>
        {!hideLogo ? (
          <Link to="/" className="flex shrink-0 items-center self-center">
            <img
              src="/home/logo (2).png"
              alt="GoCatering"
              className="h-auto w-32 object-contain"
            />
          </Link>
        ) : null}

        <div className="hidden min-w-0 flex-1 items-center justify-self-center lg:flex">
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
          menuItems={actionMenuItems}
          notifications={notifications}
          notificationRef={notificationRef}
          onNotificationClick={(notification) =>
            openNotification(notification, {
              closePopover: () => setIsNotificationOpen(false),
            })
          }
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
