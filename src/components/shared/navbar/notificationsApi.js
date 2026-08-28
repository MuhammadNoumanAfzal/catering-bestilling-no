import { graphqlRequest } from "../../../lib/api/graphqlClient";

const CLIENT_FINANCE_NOTIFICATION_FIELDS = `
  id
  type
  audience
  title
  message
  isRead
  createdAt
  invoiceId
  orderId
  paymentStatus
  actorName
  note
  rejectionReason
  receiptUrl
  transferReference
  paymentDate
`;

const NOTIFICATION_BELL_QUERY = `
  query ClientFinanceNotifications($first: Int, $status: String) {
    clientFinanceNotifications(first: $first, status: $status) {
      edges {
        node {
          ${CLIENT_FINANCE_NOTIFICATION_FIELDS}
        }
      }
      unreadCount
      totalCount
    }
  }
`;

const MARK_NOTIFICATION_READ_MUTATION = `
  mutation MarkFinanceNotificationRead($id: ID!) {
    markFinanceNotificationRead(id: $id) {
      success
      message
      notification {
        id
        isRead
      }
    }
  }
`;

const MARK_ALL_NOTIFICATIONS_READ_MUTATION = `
  mutation MarkAllFinanceNotificationsRead($audience: String!) {
    markAllFinanceNotificationsRead(audience: $audience) {
      success
      message
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

function mapNotificationType(type) {
  const normalizedType = `${type ?? ""}`.toLowerCase();

  if (
    normalizedType.includes("payment") ||
    normalizedType.includes("invoice") ||
    normalizedType.includes("settlement")
  ) {
    return "payment";
  }

  if (normalizedType.includes("delivery")) {
    return "delivery";
  }

  if (normalizedType.includes("order")) {
    return "order-update";
  }

  return "payment";
}

function resolveNotificationTarget(node) {
  if (node?.invoiceId) {
    return `/vendor-dashboard/invoices/${encodeURIComponent(node.invoiceId)}`;
  }

  if (node?.orderId) {
    return `/vendor-dashboard/orders/${encodeURIComponent(node.orderId)}`;
  }

  return "/vendor-dashboard/invoices";
}

function mapNotificationNode(node) {
  const messageParts = [sanitizeNotificationMessage(node?.message)];

  if (node?.note) {
    messageParts.push(`Note: ${node.note}`);
  }

  if (node?.rejectionReason) {
    messageParts.push(`Reason: ${node.rejectionReason}`);
  }

  if (node?.transferReference) {
    messageParts.push(`Reference: ${node.transferReference}`);
  }

  return {
    id: node?.id ?? "",
    title: node?.title || "Finance notification",
    message: messageParts.filter(Boolean).join(" "),
    timeLabel: formatNotificationTime(node?.createdAt),
    unread: !node?.isRead,
    category: node?.isRead ? "read" : "unread",
    type: mapNotificationType(node?.type),
    createdAt: node?.createdAt ? `${node.createdAt}`.split("T")[0] : "",
    dayLabel: formatDayLabel(node?.createdAt),
    notificationType: node?.type || "",
    entityId: node?.invoiceId || node?.orderId || "",
    entityType: node?.invoiceId ? "INVOICE" : node?.orderId ? "ORDER" : "",
    createdOn: node?.createdAt || "",
    actionUrl: resolveNotificationTarget(node),
    invoiceId: node?.invoiceId || "",
    orderId: node?.orderId || "",
    note: node?.note || "",
    rejectionReason: node?.rejectionReason || "",
    receiptUrl: node?.receiptUrl || "",
    transferReference: node?.transferReference || "",
    paymentDate: node?.paymentDate || "",
    paymentStatus: node?.paymentStatus || "",
    actorName: node?.actorName || "",
  };
}

export async function fetchUserNotifications() {
  const response = await graphqlRequest({
    query: NOTIFICATION_BELL_QUERY,
    variables: {
      first: 200,
      status: null,
    },
  });

  const bell = response?.clientFinanceNotifications;
  const notifications = Array.isArray(bell?.edges)
    ? bell.edges.map((edge) => mapNotificationNode(edge?.node))
    : [];

  return {
    notifications,
    unreadCount: Number(bell?.unreadCount ?? 0) || notifications.filter((item) => item.unread).length,
    totalCount: Number(bell?.totalCount ?? notifications.length) || notifications.length,
    hasNextPage: false,
    endCursor: null,
  };
}

export async function markUserNotificationAsRead(id) {
  const response = await graphqlRequest({
    query: MARK_NOTIFICATION_READ_MUTATION,
    variables: { id },
  });

  const result = response?.markFinanceNotificationRead;

  if (!result?.success || !result?.notification?.id) {
    throw new Error(result?.message || "Unable to mark the notification as read.");
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
    variables: {
      audience: "CLIENT",
    },
  });

  const result = response?.markAllFinanceNotificationsRead;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to mark all notifications as read.");
  }

  return {
    message: result?.message || "All notifications marked as read.",
    unreadCount: 0,
  };
}
