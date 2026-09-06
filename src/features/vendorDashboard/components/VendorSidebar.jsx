import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import { vendorNavigationItems } from "../data/vendorDashboardConfig";
import { confirmLogout, showSuccessToast } from "../../../utils/alerts";
import useUserNotifications from "../../../components/shared/navbar/useUserNotifications";

function getLinkClasses({ isActive }) {
  return [
    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold transition",
    isActive
      ? "bg-[#fff3ec] text-[#c75f2e]"
      : "text-white hover:bg-white/8",
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
    <aside className="hide-scrollbar flex w-full flex-col overflow-y-auto rounded-[28px] bg-[linear-gradient(180deg,#cb6432_0%,#c55b2d_100%)] px-3 py-3 text-white shadow-[0_18px_38px_rgba(146,62,26,0.22)] lg:h-screen lg:w-full lg:rounded-none lg:px-0 lg:py-0 lg:shadow-none">
      <div className="flex items-center justify-center rounded-[24px] border border-white/20 bg-white/8 px-4 py-3 lg:mx-4 lg:mt-4 lg:block lg:rounded-[22px] lg:border-white/10 lg:bg-white/12 lg:px-4 lg:py-4 lg:shadow-[0_8px_24px_rgba(0,0,0,0.08)] lg:backdrop-blur-sm">
        <img
          src="/home/whiteLogo.png"
          alt={t("vendorPanel.logoAlt")}
          className="h-12 w-auto object-contain sm:h-14 lg:h-auto lg:w-32"
        />
        <p className="hidden type-subpara mt-3 text-white/75 lg:block">Client dashboard</p>
      </div>

      <div className="mt-3 rounded-[22px] border border-white/15 bg-white/10 px-4 py-3 lg:hidden">
        <p className="text-sm font-semibold">{user?.name ?? t("vendorPanel.defaultUser")}</p>
        <p className="mt-1 text-xs text-white/75">
          {t("vendorPanel.manageSubtitle")}
        </p>
      </div>

      <nav className="hide-scrollbar mt-4 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-6 lg:flex-col lg:overflow-visible lg:px-3 lg:py-0">
        {vendorNavigationItems.map(({ labelKey, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={(navState) =>
              `${getLinkClasses(navState)} shrink-0 whitespace-nowrap lg:shrink`
            }
          >
            <div className="inline-flex h-5 w-5 items-center justify-center rounded-[6px]">
              <Icon size={14} strokeWidth={2} />
            </div>
            <span className="flex-1">{t(labelKey)}</span>
            {to === "/vendor-dashboard/notifications" && unreadNotificationCount > 0 ? (
              <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-white/18 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-[22px] border border-white/18 bg-white/10 p-3 lg:mt-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
          <div className="hidden">
            <p className="text-sm font-semibold">{user?.name ?? t("vendorPanel.defaultUser")}</p>
            <p className="mt-1 text-xs text-white/75">
              {t("vendorPanel.manageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-white transition hover:bg-white/8 sm:w-auto sm:min-w-[140px] lg:w-full"
          >
            <FiLogOut className="text-[14px]" />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
