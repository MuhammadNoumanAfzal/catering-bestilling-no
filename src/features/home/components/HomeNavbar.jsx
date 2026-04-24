import { Link } from "react-router-dom";
import {
  FiBell,
  FiGrid,
  FiHome,
  FiMenu,
  FiShoppingCart,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import NotificationPopover from "../../../components/shared/navbar/NotificationPopover";
import { navbarNotifications } from "../../../components/shared/navbar/notificationData";
import useNavbarCartSummary from "../../../components/shared/navbar/useNavbarCartSummary";
import { vendorNavigationItems } from "../../vendorDashboard/data/vendorDashboardData";
import { confirmLogout, showSuccessToast } from "../../../utils/alerts";

const homeProfileMenuItems = [
  { label: "Home", to: "/", icon: FiHome },
  { label: "Dashboard", to: "/vendor-dashboard", icon: FiGrid },
  ...vendorNavigationItems.filter((item) => item.to !== "/vendor-dashboard"),
];

export default function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isLoggedIn, user, signOut } = useAuth();
  const { itemCount: cartItemCount } = useNavbarCartSummary();
  const desktopNotificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);
  const profileMenuRef = useRef(null);
  const unreadNotificationCount = navbarNotifications.filter(
    (item) => item.unread,
  ).length;

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

    signOut();
    setIsProfileMenuOpen(false);
    closeMenu();
    await showSuccessToast("Logged out successfully");
  };

  return (
    <header className="relative z-50 w-full">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 md:px-10">
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/home/logo.png"
            alt="logo"
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-6">
          {isLoggedIn ? (
            <>
              <div className="relative" ref={desktopNotificationRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className={actionButtonClassName}
                  aria-label="Notifications"
                  aria-expanded={isNotificationOpen}
                >
                  <FiBell />
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                      {unreadNotificationCount}
                    </span>
                  ) : null}
                </button>

                {isNotificationOpen ? (
                  <NotificationPopover
                    notifications={navbarNotifications}
                    className="top-[calc(100%+14px)]"
                  />
                ) : null}
              </div>

              <Link
                to="/checkout/corporate"
                className={actionButtonClassName}
                aria-label="Go to checkout cart"
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
                  aria-label="Open profile menu"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="flex h-8 w-10 items-center justify-center rounded-full bg-[#fff1e9] text-[#c85f33]">
                    <FiUser />
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
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              className="type-h6 cursor-pointer rounded-full bg-[#c85f33] px-6 py-2 text-white transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}

          <Link
            to="/contact"
            className="type-h5 cursor-pointer rounded-full px-2 py-1 text-[#3d3d3d] transition hover:text-[#c85f33]"
          >
            Contact us
          </Link>
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 cursor-pointer items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd7] bg-white text-[22px] text-[#2f2f2f] shadow-[0_6px_16px_rgba(35,22,12,0.08)] transition duration-300 hover:scale-105 hover:border-[#d9c7ba] hover:text-[#c85f33]">
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
            <Link
              to="/contact"
              onClick={closeMenu}
              className="cursor-pointer text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Contact us
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
              Cart
            </Link>

            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
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
                  Notifications
                </button>

                {isNotificationOpen ? (
                  <div ref={mobileNotificationRef}>
                    <NotificationPopover
                      notifications={navbarNotifications}
                      className="static mt-1 w-full max-w-none shadow-none sm:shadow-[0_18px_40px_rgba(22,22,22,0.14)]"
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
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={closeMenu}
                className="mt-1 w-full cursor-pointer rounded-full bg-[#c85f33] px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
