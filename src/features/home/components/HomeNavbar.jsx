import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiShoppingCart, FiUser, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/context/AuthContext";
import NotificationPopover from "../../../components/shared/navbar/NotificationPopover";
import { navbarNotifications } from "../../../components/shared/navbar/notificationData";

export default function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const desktopNotificationRef = useRef(null);
  const mobileNotificationRef = useRef(null);
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

      if (!clickedDesktop && !clickedMobile) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          <Link
            to="/contact"
            className="type-h5 text-gray-700 transition hover:text-black"
          >
            Contact us
          </Link>

          {isLoggedIn ? (
            <>
              <div className="relative" ref={desktopNotificationRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfd7] bg-white text-xl text-[#2f2f2f] transition hover:text-[#c85f33]"
                  aria-label="Notifications"
                  aria-expanded={isNotificationOpen}
                >
                  <FiBell />
                  {unreadNotificationCount > 0 ? (
                    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                      {unreadNotificationCount}
                    </span>
                  ) : null}
                </button>

                {isNotificationOpen ? (
                  <NotificationPopover notifications={navbarNotifications} />
                ) : null}
              </div>

              <div className="flex items-center gap-3 rounded-full border border-[#eadfd7] bg-white px-2 py-1.5 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff1e9] text-[#c85f33]">
                  <FiUser />
                </div>
                <span className="type-h6 pr-2 text-[#2f2f2f]">{user?.name}</span>
              </div>
            </>
          ) : (
            <Link
              to="/signin"
              className="type-h6 rounded-full bg-[#c85f33] px-6 py-2 text-white transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}

          <Link
            to="/cart"
            className="text-3xl text-black transition hover:opacity-70"
            aria-label="Cart"
          >
            <FiShoppingCart />
          </Link>
        </nav>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center text-9xl text-black transition duration-300 hover:scale-110 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mx-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-lg">
          <nav className="flex flex-col gap-3">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Contact us
            </Link>

            <Link
              to="/cart"
              onClick={closeMenu}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
            >
              <span className="text-lg">
                <FiShoppingCart />
              </span>
              Cart
            </Link>

            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-black"
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
                      className="static mt-1 w-full max-w-none"
                    />
                  </div>
                ) : null}

                <div className="flex items-center gap-2 rounded-2xl border border-[#eadfd7] px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e9] text-[#c85f33]">
                    <FiUser />
                  </span>
                  <span className="text-sm font-medium text-[#2f2f2f]">
                    {user?.name}
                  </span>
                </div>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={closeMenu}
                className="mt-1 w-full rounded-full bg-[#c85f33] px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
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
