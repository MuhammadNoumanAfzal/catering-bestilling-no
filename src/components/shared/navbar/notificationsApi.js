import { graphqlRequest } from "../../../lib/api/graphqlClient";

const FETCH_USER_NOTIFICATIONS_QUERY = `
  query GetUserNotifications(
    $status: NotificationReadStatus
    $datePreset: NotificationDatePreset
    $first: Int = 20
    $after: String
  ) {
    userNotifications(
      status: $status
      datePreset: $datePreset
      first: $first
      after: $after
    ) {
      totalCount
      unreadCount
      edges {
        cursor
        node {
          id
          notificationType
          title
          message
          isRead
          createdAt
          orderId
          reviewId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const MARK_USER_NOTIFICATION_AS_READ_MUTATION = `
  mutation MarkUserNotificationAsRead($id: ID!) {
    markUserNotificationAsRead(id: $id) {
      success
      message
      unreadCount
      notification {
        id
        isRead
      }
    }
  }
`;

const MARK_ALL_USER_NOTIFICATIONS_AS_READ_MUTATION = `
  mutation MarkAllUserNotificationsAsRead {
    markAllUserNotificationsAsRead {
      success
      message
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

function mapNotificationType(notificationType) {
  const normalizedType = `${notificationType ?? ""}`.toLowerCase();

  if (normalizedType.includes("review") || normalizedType.includes("reply")) {
    return "review";
  }

  if (normalizedType.includes("order")) {
    return "order-update";
  }

  if (normalizedType.includes("payment") || normalizedType.includes("payout")) {
    return "payment";
  }

  if (normalizedType.includes("delivery")) {
    return "delivery";
  }

  return "menu";
}

function sanitizeNotificationMessage(message) {
  const rawMessage = `${message ?? ""}`.trim();

  if (!rawMessage) {
    return "";
  }

  return rawMessage
    .replace(/\s*->\s*['"].*?['"]\s*$/u, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function resolveNotificationTarget(node) {
  if (node?.orderId) {
    return "/vendor-dashboard/orders";
  }

  if (node?.reviewId) {
    return "/vendor-dashboard/notifications";
  }

  return "";
}

function mapNotificationNode(node) {
  return {
    id: node.id,
    title: node.title || "Notification",
    message: sanitizeNotificationMessage(node.message),
    timeLabel: formatNotificationTime(node.createdAt),
    unread: !node.isRead,
    category: node.isRead ? "read" : "unread",
    type: mapNotificationType(node.notificationType),
    createdAt: node.createdAt ? `${node.createdAt}`.split("T")[0] : "",
    dayLabel: formatDayLabel(node.createdAt),
    notificationType: node.notificationType,
    orderId: node.orderId || "",
    reviewId: node.reviewId || "",
    createdOn: node.createdAt || "",
    actionUrl: resolveNotificationTarget(node),
  };
}

function getMutationErrorMessage(result, fallbackMessage) {
  return result?.message || fallbackMessage;
}

export async function fetchUserNotifications({
  status = null,
  datePreset = null,
  first = 50,
  after = null,
} = {}) {
  const response = await graphqlRequest({
    query: FETCH_USER_NOTIFICATIONS_QUERY,
    variables: { status, datePreset, first, after },
  });

  const connection = response.userNotifications || {};

  return {
    notifications: (connection.edges || []).map((edge) =>
      mapNotificationNode(edge.node),
    ),
    unreadCount: Number(connection.unreadCount ?? 0) || 0,
    totalCount: Number(connection.totalCount ?? 0) || 0,
    hasNextPage: Boolean(connection.pageInfo?.hasNextPage),
    endCursor: connection.pageInfo?.endCursor || null,
  };
}

export async function markUserNotificationAsRead(id) {
  const response = await graphqlRequest({
    query: MARK_USER_NOTIFICATION_AS_READ_MUTATION,
    variables: { id },
  });

  const result = response?.markUserNotificationAsRead;

  if (!result?.success) {
    throw new Error(
      getMutationErrorMessage(result, "Unable to mark the notification as read."),
    );
  }

  return {
    message: result.message || "Notification marked as read.",
    unreadCount: Number(result.unreadCount ?? 0) || 0,
    notification: result.notification || null,
  };
}

export async function markAllUserNotificationsAsRead() {
  const response = await graphqlRequest({
    query: MARK_ALL_USER_NOTIFICATIONS_AS_READ_MUTATION,
  });

  const result = response?.markAllUserNotificationsAsRead;

  if (!result?.success) {
    throw new Error(
      getMutationErrorMessage(result, "Unable to mark all notifications as read."),
    );
  }

  return {
    message: result.message || "All notifications marked as read.",
    unreadCount: Number(result.unreadCount ?? 0) || 0,
  };
}
