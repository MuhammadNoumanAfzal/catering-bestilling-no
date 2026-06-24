import { useEffect, useState } from "react";
import { useAuth } from "../../../features/auth";
import { fetchUserNotifications } from "./notificationsApi";

const NOTIFICATIONS_POLL_INTERVAL_MS = 30000;

export default function useUserNotifications() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let pollTimerId = null;

    if (!isLoggedIn) {
      setNotifications([]);
       setUnreadNotificationCount(0);
      return undefined;
    }

    const loadNotifications = async () => {
      try {
        const result = await fetchUserNotifications();

        if (isMounted) {
          setNotifications(result.notifications || []);
          setUnreadNotificationCount(
            Number(result.unreadCount ?? 0) ||
              (result.notifications || []).filter((item) => item.unread).length,
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
    };
  }, [isLoggedIn]);

  return {
    notifications,
    unreadNotificationCount,
  };
}
