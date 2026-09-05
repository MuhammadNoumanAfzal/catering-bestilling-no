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

const CLIENT_ORDER_NOTIFICATIONS_QUERY = `
  query ClientOrderNotifications($first: Int) {
    clientOrders(tab: null, first: $first, after: null) {
      edges {
        node {
          id
          invoiceNumber
          status
          createdOn
          eventDate
          vendor {
            name
          }
          hasPendingVendorAdjustment
          hasPendingModificationRequest
          latestModificationRequest {
            id
            status
          }
        }
      }
    }
  }
`;

const CLIENT_SUPPORT_NOTIFICATIONS_QUERY = `
  query ClientSupportNotifications {
    mySupportTickets {
      items {
        id
        ticketNo
        subject
        status
        lastMessageAt
        unreadCount
        createdAt
      }
    }
  }
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

const LOCAL_NOTIFICATION_STATE_KEY = "client-local-notification-state";
const LOCAL_NOTIFICATION_PREFIX = "client-local-notification:";

function readLocalNotificationState() {
  if (typeof window === "undefined") {
    return { readIds: [], readAllBefore: "" };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(LOCAL_NOTIFICATION_STATE_KEY) || "{}");
    return {
      readIds: Array.isArray(saved?.readIds) ? saved.readIds : [],
      readAllBefore: `${saved?.readAllBefore || ""}`,
    };
  } catch {
    return { readIds: [], readAllBefore: "" };
  }
}

function writeLocalNotificationState(state) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LOCAL_NOTIFICATION_STATE_KEY, JSON.stringify(state));
  }
}

function isLocalNotificationRead(id, createdAt, state) {
  if (state.readIds.includes(id)) {
    return true;
  }

  return Boolean(state.readAllBefore && createdAt && createdAt <= state.readAllBefore);
}

function markLocalNotificationRead(id) {
  const state = readLocalNotificationState();
  if (!state.readIds.includes(id)) {
    writeLocalNotificationState({
      ...state,
      readIds: [...state.readIds, id].slice(-500),
    });
  }
}

function markAllLocalNotificationsRead() {
  const state = readLocalNotificationState();
  writeLocalNotificationState({ ...state, readAllBefore: new Date().toISOString() });
}

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

  if (normalizedType.includes("support") || normalizedType.includes("ticket")) {
    return "support";
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

  if (node?.ticketId) {
    return "/vendor-dashboard/support/responses";
  }

  return "/vendor-dashboard/invoices";
}

function createLocalNotification({ id, title, message, createdAt, type, actionUrl, orderId = "", ticketId = "" }, state) {
  const notificationId = `${LOCAL_NOTIFICATION_PREFIX}${id}`;
  const isRead = isLocalNotificationRead(notificationId, createdAt, state);

  return {
    id: notificationId,
    title,
    message,
    timeLabel: formatNotificationTime(createdAt),
    unread: !isRead,
    category: isRead ? "read" : "unread",
    type,
    createdAt: createdAt ? `${createdAt}`.split("T")[0] : "",
    dayLabel: formatDayLabel(createdAt),
    notificationType: type,
    entityId: orderId || ticketId,
    entityType: orderId ? "ORDER" : "SUPPORT_TICKET",
    createdOn: createdAt || "",
    actionUrl,
    orderId,
    ticketId,
    isLocal: true,
  };
}

function mapOrderNotifications(edges, state) {
  if (!Array.isArray(edges)) {
    return [];
  }

  return edges.map((edge) => {
    const order = edge?.node || {};
    const reference = order.invoiceNumber ? `Order ${order.invoiceNumber}` : "Your order";
    const vendorName = order.vendor?.name ? ` from ${order.vendor.name}` : "";
    const hasChange = order.hasPendingVendorAdjustment || order.hasPendingModificationRequest;
    const modificationStatus = `${order.latestModificationRequest?.status || ""}`.replaceAll("_", " ").toLowerCase();
    const title = hasChange ? `${reference} needs your review` : `${reference} update`;
    const message = hasChange
      ? `A change has been requested${vendorName}.`
      : `${reference}${vendorName} is ${`${order.status || "updated"}`.replaceAll("_", " ").toLowerCase()}${modificationStatus ? ` (${modificationStatus})` : ""}.`;

    return createLocalNotification(
      {
        id: `order-${order.id}`,
        title,
        message,
        createdAt: order.createdOn || order.eventDate || "",
        type: "order-update",
        actionUrl: "/vendor-dashboard/orders",
        orderId: order.id || "",
      },
      state,
    );
  });
}

function mapSupportNotifications(items, state) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((ticket) => Number(ticket?.unreadCount ?? 0) > 0)
    .map((ticket) =>
      createLocalNotification(
        {
          id: `support-${ticket.id}`,
          title: "New support reply",
          message: ticket.subject || `Support ticket ${ticket.ticketNo || "updated"}`,
          createdAt: ticket.lastMessageAt || ticket.createdAt || "",
          type: "support",
          actionUrl: "/vendor-dashboard/support/responses",
          ticketId: ticket.id || "",
        },
        state,
      ),
    );
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
  const [financeResult, ordersResult, supportResult] = await Promise.allSettled([
    graphqlRequest({
      query: NOTIFICATION_BELL_QUERY,
      variables: { first: 200, status: null },
    }),
    graphqlRequest({ query: CLIENT_ORDER_NOTIFICATIONS_QUERY, variables: { first: 100 } }),
    graphqlRequest({ query: CLIENT_SUPPORT_NOTIFICATIONS_QUERY }),
  ]);

  const financeResponse = financeResult.status === "fulfilled" ? financeResult.value : null;
  const ordersResponse = ordersResult.status === "fulfilled" ? ordersResult.value : null;
  const supportResponse = supportResult.status === "fulfilled" ? supportResult.value : null;
  const bell = financeResponse?.clientFinanceNotifications;
  const financeNotifications = Array.isArray(bell?.edges)
    ? bell.edges.map((edge) => mapNotificationNode(edge?.node))
    : [];
  const localState = readLocalNotificationState();
  const notifications = [
    ...financeNotifications,
    ...mapOrderNotifications(ordersResponse?.clientOrders?.edges, localState),
    ...mapSupportNotifications(supportResponse?.mySupportTickets?.items, localState),
  ].sort((left, right) => new Date(right.createdOn || 0) - new Date(left.createdOn || 0));

  return {
    notifications,
    unreadCount: Number(bell?.unreadCount ?? 0) || notifications.filter((item) => item.unread).length,
    totalCount: Number(bell?.totalCount ?? notifications.length) || notifications.length,
    hasNextPage: false,
    endCursor: null,
  };
}

export async function markUserNotificationAsRead(id) {
  if (`${id}`.startsWith(LOCAL_NOTIFICATION_PREFIX)) {
    markLocalNotificationRead(id);
    return { message: "Notification marked as read.", unreadCount: null, notification: { id, isRead: true } };
  }

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
  markAllLocalNotificationsRead();

  const response = await graphqlRequest({
    query: MARK_ALL_NOTIFICATIONS_READ_MUTATION,
    variables: { audience: "CLIENT" },
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
