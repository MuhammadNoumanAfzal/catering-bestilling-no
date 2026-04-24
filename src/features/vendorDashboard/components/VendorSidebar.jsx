import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/context/AuthContext";
import { vendorNavigationItems } from "../data/vendorDashboardData";

function getLinkClasses({ isActive }) {
  return [
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
    isActive
      ? "bg-white text-[#c85f33] shadow-[0_10px_24px_rgba(255,255,255,0.2)]"
      : "text-white/88 hover:bg-white/12 hover:text-white",
  ].join(" ");
}

export default function VendorSidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hide-scrollbar flex w-full flex-col overflow-y-auto bg-[#cb6033] px-4 py-4 text-white lg:h-screen lg:max-w-[280px] lg:px-5 lg:py-6">
      <div className="flex items-center justify-center rounded-[28px] border border-white/20 bg-white/8 px-5 py-4 lg:py-5">
        <img
          src="/home/logo.png"
          alt="Lunsjavtale"
          className="h-16 w-auto object-contain"
        />
      </div>

      <nav className="hide-scrollbar mt-5 flex flex-1 gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible lg:pb-0">
        {vendorNavigationItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={(navState) =>
              `${getLinkClasses(navState)} shrink-0 whitespace-nowrap lg:shrink`
            }
          >
            <Icon className="text-[18px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-5 rounded-[26px] border border-white/18 bg-white/10 p-4 lg:mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
          <div>
            <p className="text-sm font-semibold">{user?.name ?? "Vendor User"}</p>
            <p className="mt-1 text-xs text-white/75">
              Manage your restaurants and operations
            </p>
          </div>

          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-[#b44f26] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a4451f] sm:w-auto sm:min-w-[140px] lg:w-full"
          >
            <FiLogOut className="text-[16px]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
