import { vendorSettingsInitialState } from "../constants/settingsForm";

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

export function mapSettingsProfileToFormState(user) {
  const notificationPreferences = parseNotificationPreferences(
    user?.notificationPreferences,
  );
  const deliveryUpdates = notificationPreferences.deliveryUpdates ?? {};
  const orderConfirmation = notificationPreferences.orderConfirmation ?? {};

  return {
    ...vendorSettingsInitialState,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    primaryEmail: user?.email || "",
    secondaryEmail: user?.secondaryEmail || "",
    mobilePhone: user?.phone || "",
    workPhone: user?.workPhone || "",
    company: user?.companyName || "",
    jobTitle: user?.jobTitle || "",
    industry: user?.industryUsage || "",
    textNotifications: Boolean(deliveryUpdates.textMessage),
    emailNotifications: Boolean(deliveryUpdates.email),
    pushNotifications: Boolean(deliveryUpdates.pushNotification),
    orderConfirmationPush: Boolean(orderConfirmation.pushNotification),
  };
}

export function mergeSettingsFormState(currentState, nextState) {
  return {
    ...currentState,
    ...vendorSettingsInitialState,
    ...nextState,
  };
}
