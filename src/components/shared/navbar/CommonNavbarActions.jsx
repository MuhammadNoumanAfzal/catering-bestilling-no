import { Link } from "react-router-dom";
import { FiBell, FiMenu, FiShoppingCart, FiUser } from "react-icons/fi";
import NotificationPopover from "./NotificationPopover";

export default function CommonNavbarActions({
  actionMenuRef,
  cartItemCount,
  isActionMenuOpen,
  isLoggedIn,
  isNotificationOpen,
  notifications,
  onCheckoutClick,
  onCloseActionMenu,
  onNotificationToggle,
  onSignOut,
  onToggleActionMenu,
  notificationRef,
  unreadNotificationCount,
  user,
  menuItems,
}) {
  return (
    <div className="ml-auto" ref={actionMenuRef}>
      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={onNotificationToggle}
            className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#e6ddd5] bg-white text-[#2f2f2f] shadow-sm transition hover:border-[#d9c7ba] hover:text-[#c85f33]"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
          >
            <FiBell className="text-[18px]" />
            {unreadNotificationCount > 0 ? (
              <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
                {unreadNotificationCount}
              </span>
            ) : null}
          </button>

          {isNotificationOpen ? (
            <NotificationPopover notifications={notifications} />
          ) : null}
        </div>

        <button
          type="button"
          onClick={onCheckoutClick}
          className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#e6ddd5] bg-white text-[#2f2f2f] shadow-sm transition hover:border-[#d9c7ba] hover:text-[#c85f33]"
          aria-label="Go to checkout cart"
        >
          <FiShoppingCart className="text-[18px]" />
          {cartItemCount > 0 ? (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white">
              {cartItemCount}
            </span>
          ) : null}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onToggleActionMenu}
            className="flex cursor-pointer items-center gap-3 rounded-full border border-[#e6ddd5] bg-white px-2 py-1.5 shadow-sm transition hover:border-[#d9c7ba]"
            aria-label="Open navigation menu"
            aria-expanded={isActionMenuOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff1e9] text-[#c85f33]">
              <FiUser />
            </div>
            {isLoggedIn ? (
              <span className="type-h6 hidden text-[#2f2f2f] sm:inline">
                {user?.name}
              </span>
            ) : (
              <span className="type-h6 hidden text-[#2f2f2f] sm:inline">
                Menu
              </span>
            )}
            <FiMenu className="text-[18px] text-[#6a625c]" />
          </button>

          {isActionMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[220px] rounded-3xl border border-[#ece2d9] bg-white p-3 shadow-[0_18px_40px_rgba(20,20,20,0.12)]">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onCloseActionMenu}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                    >
                      <Icon className="text-[17px]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="my-1 border-t border-[#eee5dc]" />

                <Link
                  to="/contact"
                  onClick={onCloseActionMenu}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                >
                  <FiMenu className="text-[17px]" />
                  <span>Contact us</span>
                </Link>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                  >
                    <FiUser className="text-[17px]" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    onClick={onCloseActionMenu}
                    className="mt-2 flex cursor-pointer items-center justify-center rounded-full bg-[#c85f33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b6542c]"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
