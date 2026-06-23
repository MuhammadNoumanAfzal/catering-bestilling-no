import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth";
import { fetchUserNotifications } from "../../../components/shared/navbar/notificationsApi";
import NotificationSection from "../components/notification/NotificationSection";
import NotificationDateFilter from "../components/notification/NotificationDateFilter";
import NotificationTabs from "../components/notification/NotificationTabs";
import {
  groupNotificationsByDay,
  isNotificationWithinDateRange,
} from "../components/notification/notificationUtils";

function NotificationsErrorState({ message, onRetry }) {
  return (
    <div className="rounded-[24px] border border-[#f1c8bb] bg-[#fff5f1] p-6 text-center shadow-[0_12px_24px_rgba(32,32,32,0.04)]">
      <h2 className="text-lg font-semibold text-[#3a2218]">
        Unable to load notifications
      </h2>
      <p className="mt-2 text-sm text-[#8a5642]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-[#cf5c2f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b94f26]"
      >
        Try again
      </button>
    </div>
  );
}

export default function VendorNotificationsPage() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRange, setSelectedRange] = useState("all-time");
  const [customDateRange, setCustomDateRange] = useState({
    from: "",
    to: "",
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

  useEffect(() => {
    let isMounted = true;

    async function loadNotifications() {
      if (!isLoggedIn) {
        if (isMounted) {
          setNotifications([]);
          setError("");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const nextNotifications = await fetchUserNotifications();

        if (isMounted) {
          setNotifications(nextNotifications);
        }
      } catch (loadError) {
        if (isMounted) {
          setNotifications([]);
          setError(
            loadError?.message ||
              "Unable to load notifications right now.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const counts = useMemo(
    () => ({
      all: notifications.length,
      unread: notifications.filter((notification) => notification.unread)
        .length,
      read: notifications.filter((notification) => !notification.unread).length,
    }),
    [notifications],
  );

  const referenceDate = useMemo(() => {
    const timestamps = notifications
      .map((notification) => new Date(notification.createdOn).getTime())
      .filter((value) => Number.isFinite(value));

    return timestamps.length > 0
      ? new Date(Math.max(...timestamps))
      : new Date();
  }, [notifications]);

  const groupedNotifications = useMemo(() => {
    const filteredNotifications = notifications.filter((notification) => {
      const matchesTab =
        activeTab === "all" ? true : notification.category === activeTab;
      const matchesDate = isNotificationWithinDateRange(
        notification.createdAt,
        selectedRange,
        customDateRange,
        referenceDate,
      );

      return matchesTab && matchesDate;
    });

    return groupNotificationsByDay(filteredNotifications);
  }, [
    activeTab,
    customDateRange,
    notifications,
    referenceDate,
    selectedRange,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#cf5c2f] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <NotificationsErrorState
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="type-h2 text-[#191919]">Notifications</h1>
        <p className="mt-2 type-para text-[#635b53]">
          Review order updates, status changes, and account alerts in one place.
        </p>
      </section>

      {!isLoggedIn ? (
        <section className="rounded-[24px] border border-dashed border-[#ddd7d1] bg-white px-6 py-16 text-center shadow-[0_10px_24px_rgba(32,32,32,0.04)]">
          <h2 className="text-[24px] font-semibold text-[#242424]">
            Sign in to view notifications
          </h2>
          <p className="mt-3 text-sm text-[#6d655f]">
            Notifications are tied to your account and load from the API after
            sign in.
          </p>
        </section>
      ) : (
        <section className="rounded-[24px] border border-[#ddd4cb] bg-[linear-gradient(180deg,#fffdfb_0%,#ffffff_100%)] p-4 shadow-[0_18px_40px_rgba(28,28,28,0.07)] md:rounded-[28px] md:p-6">
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
          </div>

          <div className="mt-6 space-y-6">
            {groupedNotifications.length > 0 ? (
              groupedNotifications.map((group) => (
                <NotificationSection
                  key={group.dayLabel}
                  dayLabel={group.dayLabel}
                  items={group.items}
                />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#ddd4cb] bg-white px-6 py-16 text-center">
                <h2 className="text-[22px] font-semibold text-[#242424]">
                  No notifications found
                </h2>
                <p className="mt-3 text-sm text-[#6d655f]">
                  Try a different tab or date range to see more activity.
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
