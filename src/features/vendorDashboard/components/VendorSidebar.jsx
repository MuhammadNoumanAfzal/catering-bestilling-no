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
    <aside className="hide-scrollbar flex h-screen w-full max-w-[280px] flex-col overflow-y-auto bg-[#cb6033] px-5 py-6 text-white">
      <div className="flex items-center justify-center rounded-[28px] border border-white/20 bg-white/8 px-5 py-5">
        <img
          src="/home/logo.png"
          alt="Lunsjavtale"
          className="h-16 w-auto object-contain"
        />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {vendorNavigationItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={getLinkClasses}>
            <Icon className="text-[18px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-[26px] border border-white/18 bg-white/10 p-4">
        <p className="text-sm font-semibold">{user?.name ?? "Vendor User"}</p>
        <p className="mt-1 text-xs text-white/75">
          Manage your restaurants and operations
        </p>

        <button
          type="button"
          onClick={signOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-[#b44f26] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#a4451f]"
        >
          <FiLogOut className="text-[16px]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
