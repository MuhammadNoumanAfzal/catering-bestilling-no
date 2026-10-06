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
          statuses {
            status
            createdOn
          }
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
    return "Akkurat nå";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Akkurat nå";
  }

  const diffInSeconds = Math.round((createdDate.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffInSeconds);
  const rtf = new Intl.RelativeTimeFormat("nb-NO", { numeric: "auto" });

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
    return "Ukjent dato";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Ukjent dato";
  }

  return new Intl.DateTimeFormat("nb-NO", {
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


function normalizeStatusLabel(status) {
  const normalizedStatus = `${status ?? ""}`
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const labels = {
    accepted: "Godtatt",
    approved: "Godkjent",
    cancelled: "Avbrutt",
    canceled: "Avbrutt",
    completed: "Fullført",
    confirmed: "Bekreftet",
    delivered: "Levert",
    draft: "Utkast",
    failed: "Mislyktes",
    modified: "Endret",
    new: "Ny",
    overdue: "Forfalt",
    paid: "Betalt",
    pending: "Ventende",
    placed: "Bestilt",
    preparing: "Forberedes",
    ready: "Klar",
    rejected: "Avvist",
    reported: "Rapportert",
    scheduled: "Planlagt",
    unpaid: "Ubetalt",
    updated: "oppdatert",
    "out for delivery": "Ute for levering",
    "payment reported": "Betaling rapportert",
    "ready to deliver": "Klar til levering",
  };

  return labels[normalizedStatus] || normalizedStatus || "oppdatert";
}

function normalizeNotificationTitle(title, type) {
  const rawTitle = `${title || ""}`.trim();
  const normalizedTitle = rawTitle.toLowerCase();
  const normalizedType = `${type || ""}`.toLowerCase();

  if (!rawTitle) {
    return normalizedType.includes("invoice") || normalizedType.includes("payment")
      ? "Betalingsvarsel"
      : "Varsel";
  }

  if (normalizedTitle.includes("order") && normalizedTitle.includes("updated")) {
    return rawTitle
      .replace(/^order\s+/i, "Bestilling ")
      .replace(/[-–]?\s*updated$/i, " oppdatert");
  }

  if (normalizedTitle === "finance notification") {
    return "Betalingsvarsel";
  }

  if (normalizedTitle === "order placed") {
    return "Bestilling lagt inn";
  }

  if (normalizedTitle.includes("payment")) {
    return rawTitle.replace(/payment/gi, "Betaling");
  }

  return rawTitle;
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
    return `/client-dashboard/invoices/${encodeURIComponent(node.invoiceId)}`;
  }

  if (node?.orderId) {
    return `/client-dashboard/orders/${encodeURIComponent(node.orderId)}`;
  }

  if (node?.ticketId) {
    return "/client-dashboard/support/responses";
  }

  return "/client-dashboard/invoices";
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
    const normalizedStatus = `${order.status || "updated"}`.trim().toUpperCase();
    const statusEvents = Array.isArray(order.statuses) ? order.statuses : [];
    const latestStatusEvent = statusEvents
      .filter(
        (event) => `${event?.status || ""}`.trim().toUpperCase() === normalizedStatus,
      )
      .sort(
        (left, right) =>
          new Date(right?.createdOn || 0).getTime() - new Date(left?.createdOn || 0).getTime(),
      )[0];
    const statusChangedAt = latestStatusEvent?.createdOn || order.createdOn || order.eventDate || "";
    const reference = order.invoiceNumber ? `Bestilling ${order.invoiceNumber}` : "Bestillingen din";
    const vendorName = order.vendor?.name ? ` fra ${order.vendor.name}` : "";
    const hasChange = order.hasPendingVendorAdjustment || order.hasPendingModificationRequest;
    const modificationStatus = normalizeStatusLabel(order.latestModificationRequest?.status || "");
    const orderStatus = normalizeStatusLabel(order.status || "updated");
    const title = hasChange ? `${reference} må gjennomgås` : `${reference} oppdatert`;
    const message = hasChange
      ? `En endring er forespurt${vendorName}.`
      : `${reference}${vendorName} er ${orderStatus}${modificationStatus !== "oppdatert" ? ` (${modificationStatus})` : ""}.`;

    return createLocalNotification(
      {
        id: `order-${order.id}-${normalizedStatus}-${statusChangedAt}`,
        title,
        message,
        createdAt: statusChangedAt,
        type: "order-update",
        actionUrl: "/client-dashboard/orders",
        orderId: order.id || "",
      },
      state,
    );
  });
}

const SUPPORT_READ_KEY = "bestilling-client-support-read-v1";

function readSupportReadState() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SUPPORT_READ_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getComparableTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function isSupportTicketReadLocally(ticketId, lastActivityAt = "") {
  const seenAt = readSupportReadState()[String(ticketId || "").trim()];

  if (!seenAt) {
    return false;
  }

  const lastActivityTime = getComparableTime(lastActivityAt);
  return lastActivityTime === 0 || getComparableTime(seenAt) >= lastActivityTime;
}
function mapSupportNotifications(items, state) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((ticket) => {
      const lastActivityAt = ticket?.lastMessageAt || ticket?.createdAt || "";
      return Number(ticket?.unreadCount ?? 0) > 0 && !isSupportTicketReadLocally(ticket?.id, lastActivityAt);
    })
    .map((ticket) =>
      createLocalNotification(
        {
          id: `support-${ticket.id}`,
          title: "Nytt svar fra support",
          message: ticket.subject || `Supportsak ${ticket.ticketNo || "oppdatert"}`,
          createdAt: ticket.lastMessageAt || ticket.createdAt || "",
          type: "support",
          actionUrl: "/client-dashboard/support/responses",
          ticketId: ticket.id || "",
        },
        state,
      ),
    );
}

function mapNotificationNode(node) {
  const messageParts = [sanitizeNotificationMessage(node?.message)];

  if (node?.note) {
    messageParts.push(`Notat: ${node.note}`);
  }

  if (node?.rejectionReason) {
    messageParts.push(`Årsak: ${node.rejectionReason}`);
  }

  if (node?.transferReference) {
    messageParts.push(`Referanse: ${node.transferReference}`);
  }

  return {
    id: node?.id ?? "",
    title: normalizeNotificationTitle(node?.title, node?.type),
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
    paymentStatus: normalizeStatusLabel(node?.paymentStatus || ""),
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
