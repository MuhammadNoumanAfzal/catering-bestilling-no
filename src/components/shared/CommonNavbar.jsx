import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiHome, FiSearch } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import CommonNavbarActions from "./navbar/CommonNavbarActions";
import CommonNavbarFilters from "./navbar/CommonNavbarFilters";
import { formatNavbarDate, isPastDate } from "./navbar/navbarDateUtils";
import useUserNotifications from "./navbar/useUserNotifications";
import useNavbarCartSummary from "./navbar/useNavbarCartSummary";
import { useAuth } from "../../features/auth";
import { fetchVendorProfiles } from "../../features/vendor/api/vendorService";
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
  const pathname = location.pathname;
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
  } = useUserNotifications({ enableReviewPrompt: true });
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
  const [dashboardSearchResults, setDashboardSearchResults] = useState([]);
  const [isDashboardSearching, setIsDashboardSearching] = useState(false);
  const [isDashboardSearchFocused, setIsDashboardSearchFocused] = useState(false);

  useEffect(() => {
    setDraftLocation(locationValue);
  }, [locationValue]);

  useEffect(() => {
    setDraftSearch(searchQuery);
  }, [searchQuery]);

  const dropdownRef = useRef(null);
  const actionMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const dashboardSearchRef = useRef(null);

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

      if (!dashboardSearchRef.current?.contains(event.target)) {
        setIsDashboardSearchFocused(false);
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

  const isDashboardHeader = isVendorDashboardRoute(pathname);
  const shouldShowDashboardSearchResults =
    isDashboardHeader && isDashboardSearchFocused && draftSearch.trim().length > 0;

  useEffect(() => {
    const query = draftSearch.trim().toLowerCase();

    if (!isDashboardHeader || !query) {
      setDashboardSearchResults([]);
      setIsDashboardSearching(false);
      return undefined;
    }

    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsDashboardSearching(true);

      try {
        const vendors = await fetchVendorProfiles();
        if (isCancelled) return;

        const vendorResults = vendors
          .filter((vendor) => [vendor.name, vendor.cuisine, vendor.city].filter(Boolean).join(" ").toLowerCase().includes(query))
          .slice(0, 4)
          .map((vendor) => ({
            id: `vendor-${vendor.slug}`,
            label: vendor.name,
            description: ["Vendor", vendor.cuisine, vendor.city].filter(Boolean).join(" • "),
            to: `/vendor/${encodeURIComponent(vendor.slug)}`,
          }));
        const menuResults = vendors
          .flatMap((vendor) =>
            (vendor.menuSections || []).flatMap((section) =>
              (section.items || section.menuItems || []).map((item) => ({ vendor, item })),
            ),
          )
          .filter(({ item }) => [item.name, item.title, item.description].filter(Boolean).join(" ").toLowerCase().includes(query))
          .slice(0, 4)
          .map(({ vendor, item }) => ({
            id: `menu-${vendor.slug}-${item.id}`,
            label: item.name || item.title || "Menu item",
            description: ["Menu", vendor.name].filter(Boolean).join(" • "),
            to: `/vendor/${encodeURIComponent(vendor.slug)}/menu/${encodeURIComponent(item.id)}`,
          }));

        setDashboardSearchResults([...vendorResults, ...menuResults]);
      } catch {
        if (!isCancelled) setDashboardSearchResults([]);
      } finally {
        if (!isCancelled) setIsDashboardSearching(false);
      }
    }, 250);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [draftSearch, isDashboardHeader]);
  const headerClasses =
    `sticky top-0 z-40 border-b border-[#ebe4de] bg-white/92 backdrop-blur-xl ${
      isDashboardHeader ? "" : "px-4 py-2 sm:px-6 lg:px-5"
    } ${isDashboardHeader ? "lg:h-[69px]" : ""} ${className}`.trim();
  const innerClasses = isDashboardHeader
    ? "flex w-full flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-5"
    : hideLogo
      ? "flex w-full items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto]"
    : "flex w-full items-center justify-between gap-4 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto]";

  return (
    <header className={headerClasses}>
      <div className={innerClasses}>
        {!hideLogo ? (
          <Link to="/" className="flex shrink-0 items-center self-center">
            <img
              src="/home/logo (2).png"
              alt="GoCatering"
              className="h-10 w-28 object-contain"
            />
          </Link>
        ) : null}

        <div
          className={`hidden min-w-0 flex-1 items-center lg:flex ${
            isDashboardHeader ? "" : "justify-self-center"
          }`}
        >
          {isDashboardHeader ? (
            <form
              className="relative order-4 w-full lg:order-none lg:max-w-[520px] lg:flex-1"
              ref={dashboardSearchRef}
              onSubmit={(event) => {
                event.preventDefault();
                handleSearchSubmit();
              }}
            >
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#a9afba]" />
              <input
                aria-label="Search"
                className="h-11 w-full rounded-full border border-transparent bg-[#f1f4f8] py-2 pl-11 pr-4 text-[12px] font-medium text-[#231913] outline-none transition placeholder:text-[#a9afba] focus:border-[#ebddd1] focus:bg-white focus:shadow-[0_0_0_4px_rgba(206,105,56,0.11)]"
                onChange={(event) => setDraftSearch(event.target.value)}
                onFocus={() => setIsDashboardSearchFocused(true)}
                placeholder="Search orders, vendors, menus, or IDs..."
                type="search"
                value={draftSearch}
              />
              {shouldShowDashboardSearchResults ? (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 overflow-hidden rounded-[18px] border border-[#e8dfd8] bg-white shadow-[0_24px_60px_rgba(45,28,16,0.14)]">
                  {isDashboardSearching ? (
                    <p className="px-4 py-5 text-[12px] text-[#8c7f75]">Searching vendors and menus...</p>
                  ) : dashboardSearchResults.length ? (
                    <div className="max-h-[320px] overflow-y-auto p-2">
                      {dashboardSearchResults.map((result) => (
                        <button
                          className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left transition hover:bg-[#faf4ee]"
                          key={result.id}
                          onClick={() => {
                            setIsDashboardSearchFocused(false);
                            navigate(result.to);
                          }}
                          type="button"
                        >
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#fff1e8] text-[#cf6e38]"><FiSearch /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-bold text-[#231913]">{result.label}</span><span className="block truncate text-[12px] text-[#7b6f66]">{result.description}</span></span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-5 text-[12px] text-[#8c7f75]">No matching vendors or menus found.</p>
                  )}
                </div>
              ) : null}
            </form>
          ) : (
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
          )}
        </div>

        <CommonNavbarActions
          actionMenuRef={actionMenuRef}
          cartItemCount={cartItemCount}
          hasFreshNotification={hasFreshNotification}
          isAdminStyle={isDashboardHeader}
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
