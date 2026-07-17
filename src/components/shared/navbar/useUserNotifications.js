import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth";
import {
  fetchUserNotifications,
  markAllUserNotificationsAsRead,
  markUserNotificationAsRead,
} from "./notificationsApi";
import { showSuccessToast } from "../../../utils/alerts";

const NOTIFICATIONS_POLL_INTERVAL_MS = 30000;
const FRESH_NOTIFICATION_HIGHLIGHT_MS = 12000;
const LAST_ACKNOWLEDGED_NOTIFICATION_KEY = "last-acknowledged-notification-id";

function readLastAcknowledgedNotificationId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(LAST_ACKNOWLEDGED_NOTIFICATION_KEY);
}

function writeLastAcknowledgedNotificationId(notificationId) {
  if (typeof window === "undefined" || !notificationId) {
    return;
  }

  window.localStorage.setItem(
    LAST_ACKNOWLEDGED_NOTIFICATION_KEY,
    notificationId,
  );
}

export default function useUserNotifications() {
  const navigate = useNavigate();
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
          const lastAcknowledgedNotificationId =
            readLastAcknowledgedNotificationId();

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

          if (
            nextTopNotificationId &&
            nextTopNotificationId !== lastAcknowledgedNotificationId
          ) {
            setHasFreshNotification(true);
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

  const acknowledgeFreshNotifications = () => {
    const topNotificationId = notifications[0]?.id || null;

    if (!topNotificationId) {
      return;
    }

    writeLastAcknowledgedNotificationId(topNotificationId);
    setHasFreshNotification(false);
  };

  const openNotification = async (notification, { closePopover } = {}) => {
    if (!notification) {
      return;
    }

    if (notification.unread) {
      try {
        const result = await markUserNotificationAsRead(notification.id);
        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? { ...item, unread: false, category: "read" }
              : item,
          ),
        );
        setUnreadNotificationCount(Number(result.unreadCount ?? 0) || 0);
      } catch {
        // Keep navigation usable even if read state update fails.
      }
    }

    if (typeof closePopover === "function") {
      closePopover();
    }

    const target = notification.actionUrl || "/vendor-dashboard/notifications";
    navigate(target);
  };

  const readAllNotifications = async () => {
    const result = await markAllUserNotificationsAsRead();
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
        category: "read",
      })),
    );
    setUnreadNotificationCount(Number(result.unreadCount ?? 0) || 0);
    return result;
  };

  return {
    acknowledgeFreshNotifications,
    hasFreshNotification,
    notifications,
    openNotification,
    readAllNotifications,
    unreadNotificationCount,
  };
}
