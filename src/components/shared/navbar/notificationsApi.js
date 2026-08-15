import { graphqlRequest } from "../../../lib/api/graphqlClient";

const NOTIFICATION_BELL_QUERY = `
  query NotificationBell {
    notificationBell {
      unreadCount
      items {
        id
        title
        message
        entityType
        entityId
        actionUrl
        isRead
        createdAt
      }
    }
  }
`;

const MARK_NOTIFICATION_READ_MUTATION = `
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      notification {
        id
        isRead
        readAt
      }
    }
  }
`;

const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      success
      unreadCount
    }
  }
`;

function formatNotificationTime(createdAt) {
  if (!createdAt) {
    return "Just now";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Just now";
  }

  const diffInSeconds = Math.round((createdDate.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) {
    return rtf.format(diffInSeconds, "second");
  }

  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, "minute");
  }

  const diffInHours = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, "hour");
  }

  return rtf.format(Math.round(diffInHours / 24), "day");
}

function formatDayLabel(createdAt) {
  if (!createdAt) {
    return "Unknown date";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(createdDate);
}

function sanitizeNotificationMessage(message) {
  return `${message ?? ""}`
    .trim()
    .replace(/\s{2,}/g, " ");
}

function mapNotificationType(entityType, actionUrl) {
  const normalizedType = `${entityType ?? ""}`.toLowerCase();
  const normalizedUrl = `${actionUrl ?? ""}`.toLowerCase();

  if (normalizedType.includes("support") || normalizedUrl.includes("support")) {
    return "review";
  }

  if (normalizedType.includes("order") || normalizedUrl.includes("order")) {
    return "order-update";
  }

  if (normalizedType.includes("payout") || normalizedUrl.includes("payment")) {
    return "payment";
  }

  if (normalizedType.includes("delivery") || normalizedUrl.includes("delivery")) {
    return "delivery";
  }

  return "menu";
}

function resolveNotificationTarget(node) {
  const actionUrl = `${node?.actionUrl ?? ""}`.trim();
  if (actionUrl) {
    return actionUrl;
  }

  const entityType = `${node?.entityType ?? ""}`.toLowerCase();
  const entityId = `${node?.entityId ?? ""}`.trim();

  if (entityType.includes("support")) {
    return "/vendor-dashboard/support/responses";
  }

  if (entityType.includes("order")) {
    return entityId ? `/vendor-dashboard/orders/${entityId}` : "/vendor-dashboard/orders";
  }

  return "/vendor-dashboard/notifications";
}

function mapNotificationNode(node) {
  return {
    id: node?.id ?? "",
    title: node?.title || "Notification",
    message: sanitizeNotificationMessage(node?.message),
    timeLabel: formatNotificationTime(node?.createdAt),
    unread: !node?.isRead,
    category: node?.isRead ? "read" : "unread",
    type: mapNotificationType(node?.entityType, node?.actionUrl),
    createdAt: node?.createdAt ? `${node.createdAt}`.split("T")[0] : "",
    dayLabel: formatDayLabel(node?.createdAt),
    notificationType: node?.entityType || "",
    entityId: node?.entityId || "",
    entityType: node?.entityType || "",
    createdOn: node?.createdAt || "",
    actionUrl: resolveNotificationTarget(node),
  };
}

export async function fetchUserNotifications() {
  const response = await graphqlRequest({
    query: NOTIFICATION_BELL_QUERY,
  });

  const bell = response?.notificationBell;
  const notifications = Array.isArray(bell?.items)
    ? bell.items.map(mapNotificationNode)
    : [];

  return {
    notifications,
    unreadCount: Number(bell?.unreadCount ?? 0) || notifications.filter((item) => item.unread).length,
    totalCount: notifications.length,
    hasNextPage: false,
    endCursor: null,
  };
}

export async function markUserNotificationAsRead(id) {
  const response = await graphqlRequest({
    query: MARK_NOTIFICATION_READ_MUTATION,
    variables: { id },
  });

  const result = response?.markNotificationRead;

  if (!result?.notification?.id) {
    throw new Error("Unable to mark the notification as read.");
  }

  return {
    message: "Notification marked as read.",
    unreadCount: null,
    notification: result.notification,
  };
}

export async function markAllUserNotificationsAsRead() {
  const response = await graphqlRequest({
    query: MARK_ALL_NOTIFICATIONS_READ_MUTATION,
  });

  const result = response?.markAllNotificationsRead;

  if (!result?.success) {
    throw new Error("Unable to mark all notifications as read.");
  }

  return {
    message: "All notifications marked as read.",
    unreadCount: Number(result?.unreadCount ?? 0) || 0,
  };
}
