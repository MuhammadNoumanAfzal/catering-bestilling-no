import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  mapClientSettingsProfileToFormState,
  mergeClientSettingsFormState,
} from "./clientSettingsMappers";
import { UPDATE_CLIENT_NOTIFICATION_SETTINGS_MUTATION } from "./clientSettingsMutations";
import { GET_CLIENT_NOTIFICATION_SETTINGS_QUERY } from "./clientSettingsQueries";

function buildNotificationSettingsInput(formState) {
  return {
    emailEnabled: Boolean(formState.emailNotifications),
    smsEnabled: Boolean(formState.smsEnabled),
    pushEnabled: Boolean(formState.pushEnabled),
    orderAlertsEnabled: Boolean(formState.orderUpdates),
  };
}

export async function fetchClientSettingsProfile() {
  const response = await graphqlRequest({
    query: GET_CLIENT_NOTIFICATION_SETTINGS_QUERY,
  });

  if (!response?.userNotificationSettings) {
    throw new Error("Unable to load client settings.");
  }

  return mapClientSettingsProfileToFormState(response.userNotificationSettings);
}

export async function updateClientSettingsProfile(formState) {
  const response = await graphqlRequest({
    query: UPDATE_CLIENT_NOTIFICATION_SETTINGS_MUTATION,
    variables: {
      input: buildNotificationSettingsInput(formState),
    },
  });

  const result = response?.updateUserNotificationSettings;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to update notification settings.");
  }

  return {
    message: result.message || "Notification settings updated successfully.",
    formState: mergeClientSettingsFormState(
      formState,
      mapClientSettingsProfileToFormState(result.settings),
    ),
  };
}
