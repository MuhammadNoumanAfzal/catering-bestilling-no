import { useEffect, useState } from "react";
import { useAuth } from "../../../features/auth";
import { fetchUserNotifications } from "./notificationsApi";

export default function useUserNotifications() {
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    if (!isLoggedIn) {
      setNotifications([]);
      return undefined;
    }

    const loadNotifications = async () => {
      try {
        const nextNotifications = await fetchUserNotifications();

        if (isMounted) {
          setNotifications(nextNotifications);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  return {
    notifications,
    unreadNotificationCount: notifications.filter((item) => item.unread).length,
  };
}
