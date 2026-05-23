import { useEffect, useMemo, useRef, useState } from "react";
import NotificationSection from "../components/notification/NotificationSection";
import NotificationDateFilter from "../components/notification/NotificationDateFilter";
import NotificationTabs from "../components/notification/NotificationTabs";
import {
  getNotificationDateFilterLabel,
  groupNotificationsByDay,
  isNotificationWithinDateRange,
} from "../components/notification/notificationUtils";
import { vendorClientNotifications } from "../data/vendorDashboardData";

export default function VendorNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRange, setSelectedRange] = useState("last-month");
  const [customDateRange, setCustomDateRange] = useState({
    from: "2026-05-02",
    to: "2026-05-23",
  });
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const dateMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateMenuRef.current && !dateMenuRef.current.contains(event.target)) {
        setIsDateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const counts = useMemo(
    () => ({
      all: vendorClientNotifications.length,
      unread: vendorClientNotifications.filter(
        (notification) => notification.category === "unread",
      ).length,
      read: vendorClientNotifications.filter(
        (notification) => notification.category === "read",
      ).length,
    }),
    [],
  );

  const groupedNotifications = useMemo(() => {
    const filteredNotifications = vendorClientNotifications.filter((notification) => {
      const matchesTab =
        activeTab === "all" ? true : notification.category === activeTab;
      const matchesDate = isNotificationWithinDateRange(
        notification.createdAt,
        selectedRange,
        customDateRange,
        "2026-05-23",
      );

      return matchesTab && matchesDate;
    });

    return groupNotificationsByDay(filteredNotifications);
  }, [activeTab, customDateRange, selectedRange]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="type-h2 text-[#191919]">Notifications</h1>
          <p className="mt-2 max-w-2xl type-para text-[#635b53]">
            Review customer-side order updates, payment messages, and delivery activity in one place.
          </p>
        </div>
      </section>

      <section className="rounded-[28px] border border-[#ddd4cb] bg-[linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-[0_16px_34px_rgba(28,28,28,0.06)] sm:p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-[#ece4dc] pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <NotificationTabs
              activeTab={activeTab}
              onChange={setActiveTab}
              counts={counts}
            />

            <NotificationDateFilter
              customDateRange={customDateRange}
              isOpen={isDateMenuOpen}
              menuRef={dateMenuRef}
              onApplyCustomDate={() => setIsDateMenuOpen(false)}
              onCustomDateChange={(field, value) =>
                setCustomDateRange((current) => ({
                  ...current,
                  [field]: value,
                }))
              }
              onSelect={(value) => {
                setSelectedRange(value);
                if (value !== "custom-date") {
                  setIsDateMenuOpen(false);
                }
              }}
              onToggle={() => setIsDateMenuOpen((open) => !open)}
              selectedRange={selectedRange}
            />
          </div>

          <p className="text-sm text-[#847970]">
            {activeTab === "all"
              ? `Showing all notifications for ${getNotificationDateFilterLabel(selectedRange, customDateRange)}.`
              : activeTab === "unread"
              ? "Unread notifications that still need your attention."
              : "Read notifications from your recent client activity."}
          </p>
        </div>

        <div className="mt-5 space-y-6">
          {groupedNotifications.length > 0 ? (
            groupedNotifications.map((group) => (
              <NotificationSection
                key={group.dayLabel}
                dayLabel={group.dayLabel}
                items={group.items}
              />
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-[#e4d8ce] bg-[#fcfaf8] px-6 py-14 text-center">
              <h2 className="text-lg font-semibold text-[#1f1f1f]">
                No notifications here
              </h2>
              <p className="mt-2 text-sm text-[#746b63]">
                Switch tabs to review a different set of client updates.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
