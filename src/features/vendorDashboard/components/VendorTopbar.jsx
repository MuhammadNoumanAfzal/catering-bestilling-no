import { FiBell, FiChevronDown, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useAuth } from "../../auth/context/AuthContext";

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
  const { user } = useAuth();

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

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbd3] bg-white text-[#2c2c2c] transition hover:text-[#cf5c2f]"
            aria-label="Notifications"
          >
            <FiBell className="text-[18px]" />
          </button>

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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e3dbd3] bg-white text-[#2c2c2c] transition hover:text-[#cf5c2f]"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
