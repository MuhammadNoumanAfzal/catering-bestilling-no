import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiHome } from "react-icons/fi";
import CommonNavbarActions from "./navbar/CommonNavbarActions";
import CommonNavbarFilters from "./navbar/CommonNavbarFilters";
import { navbarNotifications } from "./navbar/notificationData";
import { formatNavbarDate } from "./navbar/navbarDateUtils";
import useNavbarCartSummary from "./navbar/useNavbarCartSummary";
import { useAuth } from "../../features/auth/context/AuthContext";
import { vendorNavigationItems } from "../../features/vendorDashboard/data/vendorDashboardData";
import { useBrowseFilters } from "../../app/context/BrowseFiltersContext";
import { confirmLogout, showSuccessToast } from "../../utils/alerts";

const commonProfileMenuItems = [
  { label: "Home", to: "/", icon: FiHome },
  { label: "Dashboard", to: "/vendor-dashboard", icon: FiGrid },
  ...vendorNavigationItems.filter((item) => item.to !== "/vendor-dashboard"),
];

function formatEventLabel(attendeeCount, eventName) {
  if (eventName) {
    return eventName;
  }

  if (attendeeCount > 0) {
    return `${attendeeCount} attendees`;
  }

  return "Event details";
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
    setAttendeeCount,
    setDeliveryDate,
    setDeliveryTime,
    setEventName,
    setLocationValue,
  } = useBrowseFilters();
  const { itemCount: cartItemCount } = useNavbarCartSummary();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [draftDate, setDraftDate] = useState(new Date());
  const [draftTime, setDraftTime] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [draftAttendeeCount, setDraftAttendeeCount] = useState(0);
  const [draftEventName, setDraftEventName] = useState("");
  const dropdownRef = useRef(null);
  const actionMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const unreadNotificationCount = navbarNotifications.filter(
    (item) => item.unread,
  ).length;

  const toggleDropdown = (key) => {
    setOpenDropdown((current) => {
      const nextDropdown = current === key ? null : key;

      if (nextDropdown === "delivery") {
        const nextDate = deliveryDate ?? new Date();
        setDraftDate(nextDate);
        setDraftTime(deliveryTime);
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

    if (location.pathname.startsWith("/vendor-dashboard")) {
      navigate("/");
    }
  };

  const applyEventDetails = () => {
    setAttendeeCount(draftAttendeeCount);
    setEventName(draftEventName.trim());
    setOpenDropdown(null);
  };

  const handleSignOut = async () => {
    const result = await confirmLogout();

    if (!result.isConfirmed) {
      return;
    }

    signOut();
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
              draftDate={draftDate}
              draftEventName={draftEventName}
              draftTime={draftTime}
              eventLabel={eventLabel}
              hasDeliverySelection={hasDeliverySelection}
              hasEventSelection={hasEventSelection}
              locationValue={locationValue}
              onApplyDelivery={applyDeliverySelection}
              onApplyEvent={applyEventDetails}
              onAttendeeChange={(change) =>
                setDraftAttendeeCount((current) => Math.max(0, current + change))
              }
              onDateSelect={setDraftDate}
              onEventNameChange={setDraftEventName}
              onLocationChange={setLocationValue}
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
              onSearchChange={setSearchValue}
              onTimeSelect={setDraftTime}
              openDropdown={openDropdown}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              toggleDropdown={toggleDropdown}
            />
          </div>
        </div>

        <CommonNavbarActions
          actionMenuRef={actionMenuRef}
          cartItemCount={cartItemCount}
          isActionMenuOpen={isActionMenuOpen}
          isLoggedIn={isLoggedIn}
          isNotificationOpen={isNotificationOpen}
          menuItems={commonProfileMenuItems}
          notifications={navbarNotifications}
          notificationRef={notificationRef}
          onCheckoutClick={() => {
            setIsActionMenuOpen(false);
            setIsNotificationOpen(false);
            navigate("/checkout/corporate");
          }}
          onCloseActionMenu={() => setIsActionMenuOpen(false)}
          onNotificationToggle={() => {
            setIsNotificationOpen((current) => !current);
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
