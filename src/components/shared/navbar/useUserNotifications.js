import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../features/auth";
import { fetchOrderReviewTarget } from "../../../features/order/api/orderModificationService";
import {
  fetchUserNotifications,
  markAllUserNotificationsAsRead,
  markUserNotificationAsRead,
} from "./notificationsApi";
import { showAuthErrorAlert, showDeliveredReviewPrompt, showSuccessToast } from "../../../utils/alerts";

const NOTIFICATIONS_POLL_INTERVAL_MS = 10000;
const FRESH_NOTIFICATION_HIGHLIGHT_MS = 12000;
const LAST_ACKNOWLEDGED_NOTIFICATION_KEY = "last-acknowledged-notification-id";
const LAST_SEEN_NOTIFICATION_KEY = "last-seen-notification-id";
const REVIEW_PROMPTED_NOTIFICATIONS_KEY = "review-prompted-notification-ids";

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

function readLastSeenNotificationId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(LAST_SEEN_NOTIFICATION_KEY);
}

function writeLastSeenNotificationId(notificationId) {
  if (typeof window === "undefined" || !notificationId) {
    return;
  }

  window.localStorage.setItem(LAST_SEEN_NOTIFICATION_KEY, notificationId);
}

function readReviewPromptedNotificationIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(REVIEW_PROMPTED_NOTIFICATIONS_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function writeReviewPromptedNotificationId(notificationId) {
  if (typeof window === "undefined" || !notificationId) {
    return;
  }

  const existingIds = readReviewPromptedNotificationIds();
  if (existingIds.includes(notificationId)) {
    return;
  }

  window.localStorage.setItem(
    REVIEW_PROMPTED_NOTIFICATIONS_KEY,
    JSON.stringify([...existingIds, notificationId].slice(-50)),
  );
}

function isDeliveredOrderNotification(notification) {
  const normalizedType = `${notification?.notificationType || notification?.type || ""}`
    .trim()
    .toLowerCase();
  const normalizedTitle = `${notification?.title || ""}`.trim().toLowerCase();
  const normalizedMessage = `${notification?.message || ""}`.trim().toLowerCase();
  const statusKeywords = ["delivered", "delivery", "completed", "complete"];

  if (!notification?.orderId) {
    return false;
  }

  return (
    (normalizedType.includes("order") || normalizedType.includes("delivery")) &&
    statusKeywords.some(
      (keyword) =>
        normalizedTitle.includes(keyword) || normalizedMessage.includes(keyword),
    )
  );
}

export default function useUserNotifications() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [hasFreshNotification, setHasFreshNotification] = useState(false);
  const isReviewPromptOpenRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let pollTimerId = null;
    let highlightTimerId = null;

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
          const topNotification = nextNotifications[0] || null;
          const nextTopNotificationId = nextNotifications[0]?.id || null;
          const lastAcknowledgedNotificationId =
            readLastAcknowledgedNotificationId();
          const lastSeenNotificationId = readLastSeenNotificationId();

          if (
            nextTopNotificationId &&
            nextTopNotificationId !== lastSeenNotificationId &&
            topNotification?.unread
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
              topNotification?.title || "New notification received";
            showSuccessToast(notificationTitle);
            writeLastSeenNotificationId(nextTopNotificationId);
          }

          if (
            nextTopNotificationId &&
            nextTopNotificationId !== lastAcknowledgedNotificationId
          ) {
            setHasFreshNotification(true);
          }
          setNotifications(nextNotifications);
          setUnreadNotificationCount(
            Number(result.unreadCount ?? 0) ||
              nextNotifications.filter((item) => item.unread).length,
          );

          const deliveredReviewNotification = nextNotifications.find(
            (item) =>
              isDeliveredOrderNotification(item) &&
              !readReviewPromptedNotificationIds().includes(item.id),
          );

          if (deliveredReviewNotification && !isReviewPromptOpenRef.current) {
            isReviewPromptOpenRef.current = true;

            try {
              const reviewTarget = await fetchOrderReviewTarget(
                deliveredReviewNotification.orderId,
              );
              const promptResult = await showDeliveredReviewPrompt(
                reviewTarget.vendorName,
              );
              writeReviewPromptedNotificationId(deliveredReviewNotification.id);

              if (promptResult.isConfirmed) {
                navigate(reviewTarget.reviewPath, {
                  state: {
                    autoOpenReview: true,
                    reviewOrderId: reviewTarget.orderId,
                    reviewEventDate: reviewTarget.eventDate,
                  },
                });
              }
            } catch (error) {
              await showAuthErrorAlert(
                error?.message || "Unable to open the review page right now.",
              );
            } finally {
              isReviewPromptOpenRef.current = false;
            }
          }
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
      () => {
        if (document.visibilityState === "visible") {
          void loadNotifications();
        }
      },
      NOTIFICATIONS_POLL_INTERVAL_MS,
    );

    const handleRefreshNotifications = () => {
      if (document.visibilityState === "visible") {
        void loadNotifications();
      }
    };

    window.addEventListener("focus", handleRefreshNotifications);
    document.addEventListener("visibilitychange", handleRefreshNotifications);

    return () => {
      isMounted = false;
      if (pollTimerId) {
        window.clearInterval(pollTimerId);
      }
      if (highlightTimerId) {
        window.clearTimeout(highlightTimerId);
      }
      window.removeEventListener("focus", handleRefreshNotifications);
      document.removeEventListener("visibilitychange", handleRefreshNotifications);
    };
  }, [isLoggedIn]);

  const acknowledgeFreshNotifications = () => {
    const topNotificationId = notifications[0]?.id || null;

    if (!topNotificationId) {
      return;
    }

    writeLastAcknowledgedNotificationId(topNotificationId);
    writeLastSeenNotificationId(topNotificationId);
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
        setUnreadNotificationCount((currentCount) =>
          typeof result?.unreadCount === "number"
            ? Math.max(0, Number(result.unreadCount) || 0)
            : Math.max(0, currentCount - 1),
        );
      } catch {
        // Keep navigation usable even if read state update fails.
      }
    }

    writeLastSeenNotificationId(notification.id);

    if (typeof closePopover === "function") {
      closePopover();
    }

    const target = notification.actionUrl || "/vendor-dashboard/invoices";
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
    setUnreadNotificationCount(
      typeof result?.unreadCount === "number"
        ? Math.max(0, Number(result.unreadCount) || 0)
        : 0,
    );
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
