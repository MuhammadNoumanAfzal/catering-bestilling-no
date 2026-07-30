import { clientSettingsInitialState } from "../constants/clientSettingsForm";

export function mapClientSettingsProfileToFormState(notificationSettings) {
  const settings = notificationSettings || {};

  return {
    ...clientSettingsInitialState,
    orderUpdates:
      settings.orderAlertsEnabled ??
      clientSettingsInitialState.orderUpdates,
    reviewsAndRatings:
      clientSettingsInitialState.reviewsAndRatings,
    promotionsAndTips:
      clientSettingsInitialState.promotionsAndTips,
    emailNotifications:
      settings.emailEnabled ??
      clientSettingsInitialState.emailNotifications,
    smsEnabled:
      settings.smsEnabled ??
      clientSettingsInitialState.smsEnabled,
    pushEnabled:
      settings.pushEnabled ??
      clientSettingsInitialState.pushEnabled,
    orderAlertsEnabled:
      settings.orderAlertsEnabled ??
      clientSettingsInitialState.orderAlertsEnabled,
  };
}

export function mergeClientSettingsFormState(currentState, nextState) {
  return {
    ...currentState,
    ...clientSettingsInitialState,
    ...nextState,
  };
}
