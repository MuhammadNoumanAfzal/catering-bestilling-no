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
const REVIEW_PROMPTED_ORDER_IDS_KEY_PREFIX = "review-prompted-order-ids";
const promptedOrdersByAccount = new Map();
let reviewPromptInFlight = false;

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

function normalizeOrderId(orderId) {
  return `${orderId ?? ""}`.trim();
}

function getReviewPromptedOrderIdsKey(user) {
  const userId = `${user?.id ?? ""}`.trim();
  const email = `${user?.email ?? ""}`.trim().toLowerCase();
  const identifier = email || userId;

  return identifier
    ? `${REVIEW_PROMPTED_ORDER_IDS_KEY_PREFIX}:${identifier}`
    : REVIEW_PROMPTED_ORDER_IDS_KEY_PREFIX;
}

function readReviewPromptedOrderIds(user) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const keys = new Set([getReviewPromptedOrderIdsKey(user)]);
    if (user?.id) keys.add(`${REVIEW_PROMPTED_ORDER_IDS_KEY_PREFIX}:${user.id}`);
    return [...new Set([...keys].flatMap((key) => {
      const parsedValue = JSON.parse(window.localStorage.getItem(key) || "[]");
      return Array.isArray(parsedValue) ? parsedValue.map(normalizeOrderId).filter(Boolean) : [];
    }))];
  } catch {
    return [];
  }
}

function writeReviewPromptedOrderId(user, orderId) {
  const normalizedOrderId = normalizeOrderId(orderId);

  if (typeof window === "undefined" || !normalizedOrderId) {
    return;
  }

  const existingIds = readReviewPromptedOrderIds(user);
  if (existingIds.includes(normalizedOrderId)) {
    return;
  }

  try {
    window.localStorage.setItem(
      getReviewPromptedOrderIdsKey(user),
      JSON.stringify([...existingIds, normalizedOrderId]),
    );
  } catch {
    // The in-memory guard still prevents repeats for this signed-in session.
  }
}

function isDeliveredOrderNotification(notification) {
  const normalizedType = `${notification?.notificationType || notification?.type || ""}`
    .trim()
    .toLowerCase();
  const normalizedTitle = `${notification?.title || ""}`.trim().toLowerCase();
  const normalizedMessage = `${notification?.message || ""}`.trim().toLowerCase();
  const isCompleted = /\b(delivered|completed|complete)\b/.test(
    `${normalizedTitle} ${normalizedMessage}`,
  );

  if (!notification?.orderId) {
    return false;
  }

  return (
    (normalizedType.includes("order") || normalizedType.includes("delivery")) &&
    isCompleted
  );
}

export default function useUserNotifications({ enableReviewPrompt = false } = {}) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [hasFreshNotification, setHasFreshNotification] = useState(false);
  const isReviewPromptOpenRef = useRef(false);
  const promptedOrderIdsRef = useRef(new Set());
  const enableReviewPromptRef = useRef(enableReviewPrompt);
  enableReviewPromptRef.current = enableReviewPrompt;

  useEffect(() => {
    let isMounted = true;
    let pollTimerId = null;
    let highlightTimerId = null;
    let loading = false;
    let reviewBaselineReady = false;

    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadNotificationCount(0);
      setHasFreshNotification(false);
      promptedOrderIdsRef.current = new Set();
      return undefined;
    }

    const accountKey = getReviewPromptedOrderIdsKey(user);
    const accountOrders = promptedOrdersByAccount.get(accountKey) || new Set();
    readReviewPromptedOrderIds(user).forEach((id) => accountOrders.add(id));
    promptedOrdersByAccount.set(accountKey, accountOrders);
    promptedOrderIdsRef.current = accountOrders;

    const loadNotifications = async () => {
      if (loading) return;
      loading = true;
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

          // Keep historical deliveries in the bell without replaying dialogs on login.
          if (enableReviewPromptRef.current && !reviewBaselineReady) {
            nextNotifications.filter(isDeliveredOrderNotification).forEach((item) => {
              const id = normalizeOrderId(item.orderId);
              accountOrders.add(id);
              writeReviewPromptedOrderId(user, id);
            });
            reviewBaselineReady = true;
          }

          const deliveredReviewNotification = nextNotifications.find((item) => {
            const orderId = normalizeOrderId(item.orderId);

            return (
              isDeliveredOrderNotification(item) &&
              item.unread &&
              orderId &&
              !promptedOrderIdsRef.current.has(orderId) &&
              !readReviewPromptedOrderIds(user).includes(orderId)
            );
          });

          if (
            enableReviewPromptRef.current &&
            deliveredReviewNotification &&
            !isReviewPromptOpenRef.current &&
            !reviewPromptInFlight &&
            (user?.id || user?.email)
          ) {
            const orderId = normalizeOrderId(deliveredReviewNotification.orderId);
            isReviewPromptOpenRef.current = true;
            reviewPromptInFlight = true;
            // Record the order before opening the dialog so polling cannot show it twice.
            promptedOrderIdsRef.current.add(orderId);
            writeReviewPromptedOrderId(user, orderId);

            try {
              const reviewTarget = await fetchOrderReviewTarget(
                deliveredReviewNotification.orderId,
              );
              if (!isMounted) return;
              const promptResult = await showDeliveredReviewPrompt(
                reviewTarget.vendorName,
              );
              if (isMounted && promptResult.isConfirmed) {
                navigate(reviewTarget.reviewPath, {
                  state: {
                    autoOpenReview: true,
                    reviewOrderId: reviewTarget.orderId,
                    reviewEventDate: reviewTarget.eventDate,
                  },
                });
              }
            } catch (error) {
              if (isMounted) await showAuthErrorAlert(
                error?.message || "Unable to open the review page right now.",
              );
            } finally {
              isReviewPromptOpenRef.current = false;
              reviewPromptInFlight = false;
            }
          }
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
          setUnreadNotificationCount(0);
        }
      } finally {
        loading = false;
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
  }, [isLoggedIn, user?.email, user?.id]);

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
