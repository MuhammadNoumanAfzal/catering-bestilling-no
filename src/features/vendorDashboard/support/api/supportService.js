import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import {
  CREATE_SUPPORT_TICKET_MUTATION,
  MY_SUPPORT_TICKET_QUERY,
  MY_SUPPORT_TICKETS_QUERY,
  REPLY_TO_OWN_SUPPORT_TICKET_MUTATION,
} from "./supportMutations";

const OWN_SUPPORT_MESSAGE_IDS_STORAGE_KEY = "vendor-support-own-message-ids";

function formatDisplayDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readOwnSupportMessageIds() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(OWN_SUPPORT_MESSAGE_IDS_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function storeOwnSupportMessageId(ticketId, messageId) {
  if (typeof window === "undefined" || !ticketId || !messageId) {
    return;
  }

  const currentMap = readOwnSupportMessageIds();
  const existingIds = Array.isArray(currentMap[ticketId]) ? currentMap[ticketId] : [];

  if (existingIds.includes(messageId)) {
    return;
  }

  const nextMap = {
    ...currentMap,
    [ticketId]: [...existingIds, messageId],
  };

  window.localStorage.setItem(OWN_SUPPORT_MESSAGE_IDS_STORAGE_KEY, JSON.stringify(nextMap));
}

function normalizeConversationItem(message, side = "admin", authorName = "Support") {
  return {
    id: message?.id ?? "",
    side,
    message: message?.message ?? "",
    createdAt: message?.createdAt ?? "",
    createdAtLabel: formatDisplayDate(message?.createdAt),
    author: {
      id: "",
      fullName: authorName,
      role: side === "admin" ? "Support" : "Customer",
    },
    attachments: [],
  };
}

function normalizeConversation(messages, ticketId) {
  const ownMessageIds = readOwnSupportMessageIds();
  const ownIdsForTicket = new Set(Array.isArray(ownMessageIds[ticketId]) ? ownMessageIds[ticketId] : []);

  return (Array.isArray(messages) ? messages : []).map((item, index) => {
    const isOwnMessage = ownIdsForTicket.has(item?.id) || index === 0;
    return normalizeConversationItem(
      item,
      isOwnMessage ? "customer" : "admin",
      isOwnMessage ? "You" : "Support",
    );
  });
}

function normalizeTicketListItem(item) {
  return {
    id: item?.id ?? "",
    ticketNo: item?.ticketNo ?? "",
    subject: item?.subject ?? "",
    status: item?.status ?? "",
    priority: item?.priority ?? "",
    createdAt: item?.createdAt ?? "",
    createdAtLabel: formatDisplayDate(item?.createdAt),
    updatedAt: item?.lastMessageAt ?? item?.createdAt ?? "",
    updatedAtLabel: formatDisplayDate(item?.lastMessageAt || item?.createdAt),
    lastMessageAt: item?.lastMessageAt ?? "",
    lastMessageAtLabel: formatDisplayDate(item?.lastMessageAt),
    unreadCount: Number(item?.unreadCount ?? 0),
    orderReference: item?.ticketNo ?? "",
  };
}

export async function createSupportTicket(input) {
  const subject = `${input?.subject ?? ""}`.trim();
  const description = `${input?.description ?? ""}`.trim();
  const relatedOrderId = `${input?.relatedOrderId ?? ""}`.trim();
  const attachmentUrl = `${input?.attachmentUrl ?? ""}`.trim();

  if (!subject) {
    throw new Error("Please select a support subject.");
  }

  if (!description) {
    throw new Error("Please enter a description for your issue.");
  }

  const messageParts = [description];

  if (relatedOrderId) {
    messageParts.push(`Related order: ${relatedOrderId}`);
  }

  if (attachmentUrl) {
    messageParts.push(`Attachment: ${attachmentUrl}`);
  }

  const message = messageParts.join("\n\n");

  const data = await graphqlRequest({
    query: CREATE_SUPPORT_TICKET_MUTATION,
    variables: {
      input: {
        subject,
        message,
      },
    },
  });

  const result = data?.createSupportTicket;

  if (!result?.success || !result?.ticket?.id) {
    throw new Error(result?.message || "Unable to submit support ticket.");
  }

  return {
    success: true,
    message: result?.message || "Support ticket submitted successfully.",
    ticketId: result.ticket.id,
  };
}

export async function getMySupportTickets() {
  const data = await graphqlRequest({
    query: MY_SUPPORT_TICKETS_QUERY,
  });

  const result = data?.mySupportTickets;
  const items = Array.isArray(result?.items)
    ? result.items.map(normalizeTicketListItem)
    : [];

  return {
    items,
    pageInfo: {
      page: 1,
      pageSize: items.length || 10,
      totalItems: items.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
}

export async function getMySupportTicket(ticketId) {
  const data = await graphqlRequest({
    query: MY_SUPPORT_TICKET_QUERY,
    variables: { ticketId },
  });

  const ticket = data?.supportTicket;

  if (!ticket?.id) {
    throw new Error("Unable to load support ticket.");
  }

  const messages = Array.isArray(ticket.messages) ? ticket.messages : [];

  return {
    id: ticket.id,
    ticketNo: ticket.ticketNo ?? "",
    subject: ticket.subject ?? "",
    status: ticket.status ?? "",
    priority: ticket.priority ?? "",
    createdAt: ticket.createdAt ?? "",
    createdAtLabel: formatDisplayDate(ticket.createdAt),
    updatedAt: messages[messages.length - 1]?.createdAt ?? ticket.createdAt ?? "",
    updatedAtLabel: formatDisplayDate(messages[messages.length - 1]?.createdAt || ticket.createdAt),
    orderReference: ticket.ticketNo ?? "",
    conversation: normalizeConversation(messages, ticketId),
  };
}

export async function replyToOwnSupportTicket(ticketId, message, attachmentIds = []) {
  const trimmedMessage = `${message ?? ""}`.trim();

  if (!trimmedMessage) {
    throw new Error("Please enter a reply before sending.");
  }

  const payload = {
    ticketId,
    message: trimmedMessage,
  };

  if (Array.isArray(attachmentIds) && attachmentIds.length) {
    payload.attachmentIds = attachmentIds;
  }

  const data = await graphqlRequest({
    query: REPLY_TO_OWN_SUPPORT_TICKET_MUTATION,
    variables: {
      input: payload,
    },
  });

  const result = data?.replySupportTicket;

  if (!result?.success || !result?.messageItem?.id) {
    throw new Error(result?.message || "Unable to send support reply.");
  }

  storeOwnSupportMessageId(ticketId, result.messageItem.id);

  return {
    message: result.message || "Reply sent successfully.",
    reply: normalizeConversationItem(result.messageItem, "customer", "You"),
    ticket: {
      id: result.ticket?.id ?? ticketId,
      lastMessageAt: result.ticket?.lastMessageAt ?? result.messageItem.createdAt,
      unreadCount: Number(result.ticket?.unreadCount ?? 0),
      status: result.ticket?.status ?? "",
    },
  };
}
