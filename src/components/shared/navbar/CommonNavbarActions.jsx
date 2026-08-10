import { Link, useLocation } from "react-router-dom";
import {
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { useTranslation } from "react-i18next";
import NotificationPopover from "./NotificationPopover";

export default function CommonNavbarActions({
  actionMenuRef,
  cartItemCount,
  hasFreshNotification,
  isActionMenuOpen,
  isLoggedIn,
  isNotificationOpen,
  notifications,
  onCheckoutClick,
  onCloseActionMenu,
  onNotificationClick,
  onNotificationToggle,
  onSignOut,
  onToggleActionMenu,
  notificationRef,
  unreadNotificationCount,
  user,
  menuItems,
}) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="ml-auto" ref={actionMenuRef}>
      <div className="flex items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={onNotificationToggle}
            className={`relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border bg-white text-[#2f2f2f] shadow-sm transition hover:border-[#d9c7ba] hover:text-[#c85f33] ${
              hasFreshNotification
                ? "border-[#cf6e38] text-[#c85f33] shadow-[0_0_0_4px_rgba(207,110,56,0.12)]"
                : "border-[#e6ddd5]"
            }`}
            aria-label={t("nav.notifications")}
            aria-expanded={isNotificationOpen}
          >
            <FiBell className="text-[18px]" />
            {hasFreshNotification ? (
              <span className="absolute -right-1 -top-1 z-20 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#cf6e38] opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-[#cf6e38]" />
              </span>
            ) : null}
            {unreadNotificationCount > 0 ? (
              <span className="absolute right-1 top-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-[#c85f33] px-1 text-[10px] font-bold leading-none text-white shadow-[0_4px_10px_rgba(200,95,51,0.28)]">
                {unreadNotificationCount}
              </span>
            ) : null}
          </button>

          {isNotificationOpen ? (
            <NotificationPopover
              notifications={notifications}
              onNotificationClick={onNotificationClick}
            />
          ) : null}
        </div>

        <button
          type="button"
          onClick={onCheckoutClick}
          className="relative inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#e6ddd5] bg-white text-[#2f2f2f] shadow-sm transition hover:border-[#d9c7ba] hover:text-[#c85f33]"
          aria-label={t("nav.goToCheckoutCart")}
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
            aria-label={t("nav.openMenu")}
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
            <div className="absolute right-0 top-[calc(100%+10px)] z-50 max-h-[min(70vh,calc(100vh-96px))] min-w-[220px] overflow-y-auto rounded-3xl border border-[#ece2d9] bg-white p-3 shadow-[0_18px_40px_rgba(20,20,20,0.12)]">
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
                      <span>{item.label ?? (item.labelKey ? t(item.labelKey) : "")}</span>
                    </Link>
                  );
                })}

                <div className="my-1 border-t border-[#eee5dc]" />

                <Link
                  to="/contact"
                  onClick={onCloseActionMenu}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                >
                  <FiHelpCircle className="text-[17px]" />
                  <span>{t("nav.contactUs")}</span>
                </Link>

                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-[#2f2f2f] transition hover:bg-[#faf4ee] hover:text-[#c85f33]"
                  >
                    <FiLogOut className="text-[17px]" />
                    <span>{t("nav.logout")}</span>
                  </button>
                ) : (
                  <Link
                    to="/signin"
                    state={{ from: location }}
                    onClick={onCloseActionMenu}
                    className="mt-2 flex cursor-pointer items-center justify-center rounded-full bg-[#c85f33] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b6542c]"
                  >
                    {t("nav.signIn")}
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
