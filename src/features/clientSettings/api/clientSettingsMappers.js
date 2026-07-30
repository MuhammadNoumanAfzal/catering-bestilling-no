import { clientSettingsInitialState } from "../constants/clientSettingsForm";

export function mapClientSettingsProfileToFormState(notificationSettings) {
  const settings = notificationSettings || {};

  return {
    ...clientSettingsInitialState,
    emailEnabled:
      settings.emailEnabled ??
      clientSettingsInitialState.emailEnabled,
    smsEnabled:
      settings.smsEnabled ??
      clientSettingsInitialState.smsEnabled,
    pushEnabled:
      settings.pushEnabled ??
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
