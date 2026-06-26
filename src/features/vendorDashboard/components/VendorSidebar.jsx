import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth";
import { vendorNavigationItems } from "../data/vendorDashboardConfig";
import { confirmLogout, showSuccessToast } from "../../../utils/alerts";

function getUserInitials(name = "Vendor User") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function getLinkClasses({ isActive }) {
  return [
    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-white text-[#bf5d31] shadow-[0_14px_30px_rgba(71,36,17,0.14)]"
      : "text-[#fff7f2] hover:bg-white/14 hover:text-white",
  ].join(" ");
}

export default function VendorSidebar() {
  const { user, signOut } = useAuth();
  const userName = user?.name?.trim() || "Vendor User";
  const userInitials = getUserInitials(userName);

  const handleLogout = async () => {
    const result = await confirmLogout();

    if (!result.isConfirmed) {
      return;
    }

    await signOut();
    await showSuccessToast("Logged out successfully");
  };

  return (
    <aside className="hide-scrollbar flex w-full flex-col overflow-y-auto rounded-[30px] border border-white/20 bg-[linear-gradient(180deg,#d76f3d_0%,#b9552c_58%,#8f3e21_100%)] px-3 py-3 text-white shadow-[0_24px_55px_rgba(134,56,24,0.28)] lg:h-[calc(100vh-40px)] lg:max-w-[305px] lg:px-5 lg:py-5">
      <div className="flex items-center justify-center rounded-[26px] border border-white/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] px-4 py-4 backdrop-blur lg:px-5 lg:py-6">
        <img
          src="/home/logo2.png"
          alt="Lunsjavtale"
          className="h-12 w-auto object-contain sm:h-14 lg:h-16"
        />
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-[24px] border border-white/15 bg-white/10 px-4 py-3 backdrop-blur lg:mt-4 lg:px-4 lg:py-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sm font-bold text-[#bc582d] shadow-[0_10px_22px_rgba(70,33,15,0.18)]">
          {userInitials || "VU"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{userName}</p>
          <p className="mt-1 text-xs text-white/76">
            Manage orders, invoices, and vendor operations
          </p>
        </div>
      </div>

      <nav className="hide-scrollbar mt-4 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-6 lg:flex-col lg:overflow-visible lg:pb-0">
        {vendorNavigationItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={(navState) =>
              `${getLinkClasses(navState)} shrink-0 whitespace-nowrap px-3 py-2.5 lg:shrink lg:px-4 lg:py-3.5`
            }
          >
            <Icon className="text-[18px] transition group-hover:scale-105" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-[24px] border border-white/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-3 backdrop-blur lg:mt-6 lg:p-4">
        <div className="flex flex-col gap-4">
          <div className="hidden rounded-[20px] border border-white/12 bg-white/8 px-4 py-3 lg:block">
            <p className="text-sm font-semibold">Need a quick reset?</p>
            <p className="mt-1 text-xs leading-5 text-white/78">
              Securely sign out of your account from here anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/16 bg-[linear-gradient(180deg,#8f3f22_0%,#773319_100%)] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <FiLogOut className="text-[16px]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
