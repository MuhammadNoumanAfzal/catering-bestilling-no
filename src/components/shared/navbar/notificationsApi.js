import { graphqlRequest } from "../../../lib/api/graphqlClient";

const FETCH_USER_NOTIFICATIONS_QUERY = `
  query FetchUserNotifications {
    userNotifications {
      totalCount
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
        }
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

function mapNotificationNode(node) {
  return {
    id: node.id,
    title: node.title || "Notification",
    message: node.message || "",
    timeLabel: formatNotificationTime(node.createdOn),
    unread: !node.isSeen,
    notificationType: node.notificationType,
    objectId: node.objectId,
    status: node.status,
    createdOn: node.createdOn,
  };
}

export async function fetchUserNotifications() {
  const response = await graphqlRequest({
    query: FETCH_USER_NOTIFICATIONS_QUERY,
  });

  return (response.userNotifications?.edges || []).map((edge) =>
    mapNotificationNode(edge.node),
  );
}
