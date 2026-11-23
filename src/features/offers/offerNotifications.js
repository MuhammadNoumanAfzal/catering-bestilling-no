export const CLIENT_OFFER_NOTIFICATIONS_QUERY = `query ClientOfferNotifications {
  myNotifications(first:200,filter:{status:ALL}) {
    edges { node { id type title message isRead isArchived createdAt entity { entityType entityId actionUrl } } }
  }
}`;
export const OFFER_NOTIFICATION_PREFIX = 'client-offer-feed:';

export function mapOfferNotification(node) {
  const entityType = String(node?.entity?.entityType || '').toUpperCase();
  if (!node?.id || node.isArchived || !/OFFER/i.test(`${node.type || ''} ${entityType}`)) return null;
  const id = /OFFER/.test(entityType) ? node.entity?.entityId : null;
  return {
    id: OFFER_NOTIFICATION_PREFIX + node.id,
    title: node.title || 'Offer update', message: node.message || '',
    unread: !node.isRead, category: node.isRead ? 'read' : 'unread',
    type: 'offer', notificationType: node.type, createdOn: node.createdAt,
    createdAt: String(node.createdAt || '').split('T')[0],
    entityType, entityId: id || '',
    actionUrl: id ? '/account/my-offers/' + encodeURIComponent(id) : '/account/my-offers',
  };
}
