import { graphqlRequest } from "../../../lib/api/graphqlClient";

const FETCH_USER_NOTIFICATIONS_QUERY = `
  query FetchUserNotifications($first: Int, $after: String) {
    userNotifications(first: $first, after: $after) {
      totalCount
      unreadCount
      edges {
        node {
          id
          title
          message
          notificationType
          objectId
          status
          isSeen
          createdOn
          actionUrl
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function formatNotificationTime(createdOn) {
  if (!createdOn) {
    return "Just now";
  }

  const createdAt = new Date(createdOn);

  if (Number.isNaN(createdAt.getTime())) {
    return "Just now";
  }

  const diffInSeconds = Math.round((createdAt.getTime() - Date.now()) / 1000);
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

  const diffInDays = Math.round(diffInHours / 24);
  return rtf.format(diffInDays, "day");
}

function formatDayLabel(createdOn) {
  if (!createdOn) {
    return "Unknown date";
  }

  const createdAt = new Date(createdOn);

  if (Number.isNaN(createdAt.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(createdAt);
}

function mapNotificationType(notificationType) {
  const normalizedType = `${notificationType ?? ""}`.toLowerCase();

  if (normalizedType.includes("review") || normalizedType.includes("reply")) {
    return "review";
  }

  if (normalizedType.includes("order")) {
    return "order-update";
  }

  if (normalizedType.includes("payment")) {
    return "payment";
  }

  if (normalizedType.includes("delivery")) {
    return "delivery";
  }

  return "menu";
}

function mapNotificationNode(node) {
  return {
    id: node.id,
    title: node.title || "Notification",
    message: node.message || "",
    timeLabel: formatNotificationTime(node.createdOn),
    unread: !node.isSeen,
    category: node.isSeen ? "read" : "unread",
    type: mapNotificationType(node.notificationType),
    createdAt: node.createdOn ? `${node.createdOn}`.split("T")[0] : "",
    dayLabel: formatDayLabel(node.createdOn),
    notificationType: node.notificationType,
    objectId: node.objectId,
    status: node.status,
    createdOn: node.createdOn,
    actionUrl: node.actionUrl || "",
  };
}

export async function fetchUserNotifications({ first = 50, after = null } = {}) {
  const response = await graphqlRequest({
    query: FETCH_USER_NOTIFICATIONS_QUERY,
    variables: { first, after },
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
