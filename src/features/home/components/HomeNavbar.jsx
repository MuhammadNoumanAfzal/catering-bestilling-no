import { Link, useLocation } from "react-router-dom";
import {
  FiBell,
  FiGrid,
  FiHome,
  FiMenu,
  FiSettings,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import NotificationPopover from "../../../components/shared/navbar/NotificationPopover";
import useNavbarCartSummary from "../../../components/shared/navbar/useNavbarCartSummary";
import useUserNotifications from "../../../components/shared/navbar/useUserNotifications";
import { vendorNavigationItems } from "../../vendorDashboard/data/vendorDashboardConfig";
import { confirmLogout, showSuccessToast } from "../../../utils/alerts";
import LanguageSwitcher from "../../../components/shared/LanguageSwitcher";

function getUserAvatarUrl(user) {
  return user?.avatarThumbnailUrl || user?.avatarUrl || "";
}

function getUserInitials(user) {
  const source =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "U";

  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function HomeNavbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isLoggedIn, user, signOut } = useAuth();
  const { itemCount: cartItemCount } = useNavbarCartSummary();
  const {
    acknowledgeFreshNotifications,
    hasFreshNotification,
    notifications,
    openNotification,
    unreadNotificationCount,
  } = useUserNotifications();
  const desktopNotificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);
  const profileMenuRef = useRef(null);
  const avatarUrl = getUserAvatarUrl(user);
  const userInitials = getUserInitials(user);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(event) {
      const clickedDesktop = desktopNotificationRef.current?.contains(
        event.target,
      );
      const clickedMobile = mobileNotificationRef.current?.contains(
        event.target,
      );
      const clickedProfile = profileMenuRef.current?.contains(event.target);

      if (!clickedDesktop && !clickedMobile) {
        setIsNotificationOpen(false);
      }

      if (!clickedProfile) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actionButtonClassName =
    "relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#eadfd7] bg-white text-[1.1rem] text-[#2f2f2f] shadow-[0_6px_16px_rgba(35,22,12,0.08)] transition hover:-translate-y-[1px] hover:border-[#d9c7ba] hover:text-[#c85f33]";

  const handleLogout = async () => {
    const result = await confirmLogout();

    if (!result.isConfirmed) {
      return;
    }

    await signOut();
    setIsProfileMenuOpen(false);
    closeMenu();
    await showSuccessToast("Logged out successfully");
  };

  const homeProfileMenuItems = [
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

  return (
    <header className="relative z-50 w-full">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-10">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/home/logo (2).png"
            alt="GoCatering"
            className="h-22 w-auto object-contain sm:h-12 md:h-34"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-6">
          <LanguageSwitcher className="mr-1" />

          {isLoggedIn ? (
            <>
              <div className="relative" ref={desktopNotificationRef}>
                <button
                  type="button"
                  onClick={() =>
                    setIsNotificationOpen((current) => {
                      const nextValue = !current;

                      if (nextValue) {
                        acknowledgeFreshNotifications();
                      }

                      return nextValue;
                    })
                  }
                  className={`${actionButtonClassName} ${
                    hasFreshNotification
                      ? "border-[#cf6e38] text-[#c85f33] shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                      : ""
                  }`}
                  aria-label={t("nav.notifications")}
                  aria-expanded={isNotificationOpen}
                >
                  <FiBell />
                  {hasFreshNotification ? (
                    <span className="absolute -right-1 -top-1 z-20 flex h-3.5 w-3.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#cf6e38] opacity-60" />
                      <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#cf6e38]" />
                    </span>
                  ) : null}
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute right-1 top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(200,95,51,0.28)]">
                      {unreadNotificationCount}
                    </span>
                  ) : null}
                </button>

                {isNotificationOpen ? (
                  <NotificationPopover
                    notifications={notifications}
                    className="right-0 top-[calc(100%+14px)]"
                    onNotificationClick={(notification) =>
                      openNotification(notification, {
                        closePopover: () => setIsNotificationOpen(false),
                      })
                    }
                  />
                ) : null}
              </div>

              <Link
                to="/checkout/corporate"
                className={actionButtonClassName}
                aria-label={t("nav.goToCheckoutCart")}
              >
                <FiShoppingCart />
                {cartItemCount > 0 ? (
                  <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                    {cartItemCount}
                  </span>
                ) : null}
              </Link>

              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileMenuOpen((current) => !current);
                    setIsNotificationOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-full border border-[#eadfd7] bg-white px-2 py-1.5 pr-4 shadow-[0_8px_20px_rgba(35,22,12,0.08)] transition hover:border-[#d9c7ba]"
                  aria-label={t("nav.openProfileMenu")}
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="flex h-8 w-10 items-center justify-center overflow-hidden rounded-full bg-[#fff1e9] text-[11px] font-bold text-[#c85f33]">
                    {avatarUrl ? (
                      <img
                        alt={user?.name || "User"}
                        className="h-full w-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="type-h6 truncate text-[#2f2f2f]">
                      {user?.name}
                    </p>
                  </div>
                  <FiMenu className="text-[18px] text-[#6a625c]" />
                </button>

                {isProfileMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-[220px] rounded-[30px] border border-[#ece2d9] bg-white p-3 shadow-[0_18px_40px_rgba(20,20,20,0.12)]">
                    <div className="space-y-1">
                      {homeProfileMenuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                          >
                            <Icon className="text-[17px]" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}

                      <div className="my-1 border-t border-[#eee5dc]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                      >
                        <FiUser className="text-[17px]" />
                        <span>{t("nav.logout")}</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              state={{ from: location }}
              className="type-h6 cursor-pointer rounded-full bg-[#c85f33] px-6 py-2 text-white transition hover:opacity-90"
            >
              {t("nav.signIn")}
            </Link>
          )}

          <Link
            to="/contact"
            className="type-h5 cursor-pointer rounded-full px-2 py-1 text-[#3d3d3d] transition hover:text-[#c85f33]"
          >
            {t("nav.contactUs")}
          </Link>
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center md:hidden"
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={open}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#eadfd7] bg-white text-[20px] text-[#2f2f2f] shadow-[0_6px_16px_rgba(35,22,12,0.08)] transition duration-300 hover:scale-105 hover:border-[#d9c7ba] hover:text-[#c85f33]">
            {open ? <FiX /> : <FiMenu />}
          </span>
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out md:hidden ${
          open
            ? "max-h-[calc(100vh-88px)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="mx-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <LanguageSwitcher className="justify-between" />

            <Link
              to="/contact"
              onClick={closeMenu}
              className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-black"
            >
              {t("nav.contactUs")}
            </Link>

            <Link
              to="/checkout/corporate"
              onClick={closeMenu}
              className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              <span className="relative text-lg">
                <FiShoppingCart />
                {cartItemCount > 0 ? (
                  <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                    {cartItemCount}
                  </span>
                ) : null}
              </span>
              {t("nav.cart")}
            </Link>

            {isLoggedIn ? (
              <>
                <div className="border-t border-[#eee5dc] pt-2">
                  <div className="flex flex-col gap-1">
                    {homeProfileMenuItems.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            closeMenu();
                          }}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                        >
                          <Icon className="text-[16px]" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setIsNotificationOpen((current) => {
                      const nextValue = !current;

                      if (nextValue) {
                        acknowledgeFreshNotifications();
                      }

                      return nextValue;
                    })
                  }
                  className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
                  aria-expanded={isNotificationOpen}
                >
                  <span className="relative">
                    <FiBell />
                    {unreadNotificationCount > 0 ? (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                        {unreadNotificationCount}
                      </span>
                    ) : null}
                  </span>
                  {t("nav.notifications")}
                </button>

                {isNotificationOpen ? (
                  <div ref={mobileNotificationRef}>
                    <NotificationPopover
                      notifications={notifications}
                      className="static mt-1 w-full max-w-none shadow-none sm:shadow-[0_18px_40px_rgba(22,22,22,0.14)]"
                      onNotificationClick={(notification) =>
                        openNotification(notification, {
                          closePopover: () => setIsNotificationOpen(false),
                        })
                      }
                    />
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-2xl border border-[#eadfd7] px-3 py-2 text-left"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e9] text-[#c85f33]">
                    <FiUser />
                  </span>
                  <span className="text-sm font-medium text-[#2f2f2f]">
                    {t("nav.logout")}
                  </span>
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                state={{ from: location }}
                onClick={closeMenu}
                className="mt-1 w-full cursor-pointer rounded-full bg-[#c85f33] px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                {t("nav.signIn")}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
