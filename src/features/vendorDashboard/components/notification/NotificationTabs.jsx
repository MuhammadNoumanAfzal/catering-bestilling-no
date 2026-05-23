import { NOTIFICATION_TABS } from "./notificationUtils";

export default function NotificationTabs({ activeTab, onChange, counts }) {
  return (
    <div className="hide-scrollbar overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 rounded-full border border-[#eadfd5] bg-[#fcfaf8] p-1">
        {NOTIFICATION_TABS.map((tab) => {
          const isActive = tab.value === activeTab;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={[
                "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-[#cf6e38] text-white shadow-[0_10px_20px_rgba(207,110,56,0.24)]"
                  : "text-[#5b534c] hover:bg-white",
              ].join(" ")}
            >
              <span>{tab.label}</span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 text-xs",
                  isActive ? "bg-white/20 text-white" : "bg-white text-[#8b8178]",
                ].join(" ")}
              >
                {counts[tab.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
