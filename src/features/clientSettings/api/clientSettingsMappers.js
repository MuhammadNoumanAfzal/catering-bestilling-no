import { clientSettingsInitialState } from "../constants/clientSettingsForm";

export function mapClientSettingsProfileToFormState(profile) {
  const notificationSettings = profile?.notificationSettings || {};
  const user = profile?.user || {};

  return {
    ...clientSettingsInitialState,
    id: user.id || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    fullName:
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim(),
    email: user.email || "",
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    avatarThumbnailUrl: user.avatarThumbnailUrl || "",
    avatarUpdatedAt: user.avatarUpdatedAt || "",
    profileCompletionPercent:
      Number(user.profileCompletionPercent ?? clientSettingsInitialState.profileCompletionPercent) || 0,
    emailEnabled:
      notificationSettings.emailEnabled ??
      clientSettingsInitialState.emailEnabled,
    smsEnabled:
      notificationSettings.smsEnabled ??
      clientSettingsInitialState.smsEnabled,
    pushEnabled:
      notificationSettings.pushEnabled ??
      clientSettingsInitialState.pushEnabled,
  };
}

export function mergeClientSettingsFormState(currentState, nextState) {
  return {
    ...currentState,
    ...clientSettingsInitialState,
    ...nextState,
  };
}
