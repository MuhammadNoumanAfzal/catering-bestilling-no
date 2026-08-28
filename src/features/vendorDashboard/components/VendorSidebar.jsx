import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import { vendorNavigationItems } from "../data/vendorDashboardConfig";
import { confirmLogout, showSuccessToast } from "../../../utils/alerts";
import useUserNotifications from "../../../components/shared/navbar/useUserNotifications";

function getLinkClasses({ isActive }) {
  return [
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-white text-[#c85f33] shadow-[0_10px_24px_rgba(255,255,255,0.2)]"
      : "text-white/88 hover:bg-white/12 hover:text-white",
  ].join(" ");
}

export default function VendorSidebar() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { unreadNotificationCount } = useUserNotifications();

  const handleLogout = async () => {
    const result = await confirmLogout();

    if (!result.isConfirmed) {
      return;
    }

    await signOut();
    await showSuccessToast(t("vendorPanel.loggedOutSuccess"));
  };

  return (
    <aside className="hide-scrollbar flex w-full flex-col overflow-y-auto rounded-[28px] bg-[#cb6033] px-3 py-3 text-white shadow-[0_18px_38px_rgba(146,62,26,0.22)] lg:h-screen lg:max-w-[280px] lg:rounded-none lg:px-5 lg:py-6 lg:shadow-none">
      <div className="flex items-center justify-center rounded-[24px] border border-white/20 bg-white/8 px-4 py-3 lg:rounded-[28px] lg:px-5 lg:py-5">
        <img
          src="/home/whiteLogo.png"
          alt={t("vendorPanel.logoAlt")}
          className="h-12 w-auto object-contain sm:h-14 lg:h-16"
        />
      </div>

      <div className="mt-3 rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold">{user?.name ?? t("vendorPanel.defaultUser")}</p>
        <p className="mt-1 text-xs text-white/75">
          {t("vendorPanel.manageSubtitle")}
        </p>
      </div>

      <nav className="hide-scrollbar mt-4 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
        {vendorNavigationItems.map(({ labelKey, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={(navState) =>
              `${getLinkClasses(navState)} shrink-0 whitespace-nowrap px-3 py-2.5 lg:shrink lg:px-4 lg:py-3`
            }
          >
            <div className="relative">
              <Icon className="text-[18px]" />
              {to === "/vendor-dashboard/notifications" && unreadNotificationCount > 0 ? (
                <span className="absolute -right-3 -top-2 inline-flex min-w-[16px] items-center justify-center rounded-full bg-[#c85f33] px-1 py-0.5 text-[8px] font-bold leading-none text-white">
                  {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
                </span>
              ) : null}
            </div>
            <span className="flex-1">{t(labelKey)}</span>
            {to === "/vendor-dashboard/notifications" && unreadNotificationCount > 0 ? (
              <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-white/18 px-1.5 py-0.5 text-[10px] font-bold leading-none text-current">
                {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-[22px] border border-white/18 bg-white/10 p-3 lg:mt-6 lg:rounded-[26px] lg:p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold">{user?.name ?? t("vendorPanel.defaultUser")}</p>
            <p className="mt-1 text-xs text-white/75">
              {t("vendorPanel.manageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-[#b44f26] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a4451f] sm:w-auto sm:min-w-[140px] lg:w-full"
          >
            <FiLogOut className="text-[16px]" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
