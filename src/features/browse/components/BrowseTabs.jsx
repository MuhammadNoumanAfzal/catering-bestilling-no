import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { browseTabs } from "../data/browseData";

export default function BrowseTabs({
  gapless = false,
  showCenterDivider = false,
}) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto w-full max-w-[440px] rounded-[16px] border border-[#decdbd] bg-[linear-gradient(180deg,#fbf6ef_0%,#efe2d3_100%)] p-1 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_24px_rgba(102,54,26,0.08)] sm:p-1.5 md:max-w-[450px] md:rounded-[24px]">
      <div
        className={`relative grid grid-cols-2 ${gapless ? "gap-0" : "gap-1.5"}`}
      >
        {showCenterDivider ? (
          <span className="pointer-events-none absolute inset-y-2 left-1/2 z-10 w-px -translate-x-1/2 bg-[#dcc8b5] shadow-[1px_0_0_rgba(255,255,255,0.82)]" />
        ) : null}

        {browseTabs.map((tab, index) => (
          <NavLink
            key={tab.id}
            to={tab.href}
            className={({ isActive }) =>
              `flex min-h-[40px] items-center justify-center px-2.5 py-2 text-center transition sm:px-3 md:min-h-[38px] md:px-5 ${
                isActive
                  ? "bg-[#c85f33] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_18px_rgba(176,84,39,0.2)]"
                  : "bg-transparent text-[#5d3924] hover:bg-[#f7ebde]"
              } ${
                gapless
                  ? index === 0
                    ? "rounded-l-[14px] rounded-r-none md:rounded-l-[20px]"
                    : "rounded-r-[14px] rounded-l-none md:rounded-r-[20px]"
                  : "rounded-[14px] md:rounded-[20px]"
              }`
            }
          >
            <span className="text-[10px] font-semibold leading-[1.15] sm:text-[13px] md:text-[16px]">
              {t(tab.labelKey)}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
