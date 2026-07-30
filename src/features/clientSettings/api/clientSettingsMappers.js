import { clientSettingsInitialState } from "../constants/clientSettingsForm";

function parseNotificationPreferences(rawValue) {
  if (!rawValue) {
    return {};
  }

  if (typeof rawValue === "object") {
    return rawValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return {};
  }
}

export function mapClientSettingsProfileToFormState(user) {
  const notificationPreferences = parseNotificationPreferences(
    user?.notificationPreferences,
  );
  const deliveryUpdates = notificationPreferences.deliveryUpdates ?? {};
  const orderConfirmation = notificationPreferences.orderConfirmation ?? {};

  return {
    ...clientSettingsInitialState,
    newOrders:
      notificationPreferences.newOrders ??
      orderConfirmation.pushNotification ??
      clientSettingsInitialState.newOrders,
    orderUpdates:
      notificationPreferences.orderUpdates ??
      deliveryUpdates.pushNotification ??
      clientSettingsInitialState.orderUpdates,
    reviewsAndRatings:
      notificationPreferences.reviewsAndRatings ??
      clientSettingsInitialState.reviewsAndRatings,
    promotionsAndTips:
      notificationPreferences.promotionsAndTips ??
      clientSettingsInitialState.promotionsAndTips,
    emailNotifications:
      notificationPreferences.emailNotifications ??
      deliveryUpdates.email ??
      clientSettingsInitialState.emailNotifications,
    smsEnabled:
      notificationPreferences.smsEnabled ??
      deliveryUpdates.textMessage ??
      clientSettingsInitialState.smsEnabled,
  };
}

export function mergeClientSettingsFormState(currentState, nextState) {
  return {
    ...currentState,
    ...clientSettingsInitialState,
    ...nextState,
  };
}
