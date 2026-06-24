import { useEffect, useState } from "react";
import { useAuth } from "../../../features/auth";
import { fetchUserNotifications } from "./notificationsApi";
import { showSuccessToast } from "../../../utils/alerts";

const NOTIFICATIONS_POLL_INTERVAL_MS = 30000;
const FRESH_NOTIFICATION_HIGHLIGHT_MS = 12000;

export default function useUserNotifications() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [hasFreshNotification, setHasFreshNotification] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let pollTimerId = null;
    let highlightTimerId = null;
    let previousTopNotificationId = null;

    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadNotificationCount(0);
      setHasFreshNotification(false);
      return undefined;
    }

    const loadNotifications = async () => {
      try {
        const result = await fetchUserNotifications();

        if (isMounted) {
          const nextNotifications = result.notifications || [];
          const nextTopNotificationId = nextNotifications[0]?.id || null;

          if (
            previousTopNotificationId &&
            nextTopNotificationId &&
            nextTopNotificationId !== previousTopNotificationId
          ) {
            setHasFreshNotification(true);
            if (highlightTimerId) {
              window.clearTimeout(highlightTimerId);
            }
            highlightTimerId = window.setTimeout(() => {
              if (isMounted) {
                setHasFreshNotification(false);
              }
            }, FRESH_NOTIFICATION_HIGHLIGHT_MS);

            const notificationTitle =
              nextNotifications[0]?.title || "New notification received";
            showSuccessToast(notificationTitle);
          }

          previousTopNotificationId = nextTopNotificationId;
          setNotifications(nextNotifications);
          setUnreadNotificationCount(
            Number(result.unreadCount ?? 0) ||
              nextNotifications.filter((item) => item.unread).length,
          );
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
          setUnreadNotificationCount(0);
        }
      }
    };

    loadNotifications();
    pollTimerId = window.setInterval(
      loadNotifications,
      NOTIFICATIONS_POLL_INTERVAL_MS,
    );

    return () => {
      isMounted = false;
      if (pollTimerId) {
        window.clearInterval(pollTimerId);
      }
      if (highlightTimerId) {
        window.clearTimeout(highlightTimerId);
      }
    };
  }, [isLoggedIn]);

  return {
    hasFreshNotification,
    notifications,
    unreadNotificationCount,
  };
}
