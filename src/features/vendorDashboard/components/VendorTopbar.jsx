import { useEffect, useRef, useState } from "react";
import { FiBell, FiChevronDown, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";
import NotificationPopover from "../../../components/shared/navbar/NotificationPopover";
import { navbarNotifications } from "../../../components/shared/navbar/notificationData";
import useNavbarCartSummary from "../../../components/shared/navbar/useNavbarCartSummary";

function FilterButton({ label }) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-2 text-sm font-medium text-[#4a4a4a] transition hover:border-[#cf5c2f] hover:text-[#cf5c2f]"
    >
      <span>{label}</span>
      <FiChevronDown className="text-[14px]" />
    </button>
  );
}

export default function VendorTopbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount: cartItemCount } = useNavbarCartSummary();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const unreadNotificationCount = navbarNotifications.filter(
    (item) => item.unread,
  ).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-[#ece5dd] bg-[#fcfaf7]/95 px-5 py-4 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <FilterButton label="Bergen" />
          <FilterButton label="Any time" />
          <FilterButton label="Event details" />

          <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full border border-[#ddd5cd] bg-white px-4 py-2">
            <FiSearch className="text-[16px] text-[#8d837a]" />
            <input
              type="text"
              placeholder="Search restaurant..."
              className="w-full bg-transparent text-sm text-[#383838] outline-none placeholder:text-[#aaa196]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-[#333333] transition hover:text-[#cf5c2f]"
          >
            Contact us
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setIsNotificationOpen((current) => !current)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbd3] bg-white text-[#2c2c2c] transition hover:text-[#cf5c2f]"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
            >
              <FiBell className="text-[18px]" />
              {unreadNotificationCount > 0 ? (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cf5c2f] px-1 text-[10px] font-bold leading-none text-white">
                  {unreadNotificationCount}
                </span>
              ) : null}
            </button>

            {isNotificationOpen ? (
              <NotificationPopover notifications={navbarNotifications} />
            ) : null}
          </div>

          <div className="flex items-center gap-3 rounded-full border border-[#e3dbd3] bg-white px-2 py-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0e9] text-[#cf5c2f]">
              <FiUser />
            </div>
            <div className="pr-2">
              <p className="text-sm font-semibold text-[#222222]">
                {user?.name ?? "Vendor"}
              </p>
              <p className="text-xs text-[#8a8178]">Administrator</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout/corporate")}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbd3] bg-white text-[#2c2c2c] transition hover:text-[#cf5c2f]"
            aria-label="Go to checkout cart"
          >
            <FiShoppingCart className="text-[18px]" />
            {cartItemCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cf5c2f] px-1 text-[10px] font-bold leading-none text-white">
                {cartItemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
