import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  mapClientSettingsProfileToFormState,
  mergeClientSettingsFormState,
} from "./clientSettingsMappers";
import { UPDATE_CLIENT_SETTINGS_MUTATION } from "./clientSettingsMutations";
import { GET_CLIENT_SETTINGS_PROFILE_QUERY } from "./clientSettingsQueries";

function buildNotificationPreferencesInput(formState) {
  return {
    newOrders: Boolean(formState.newOrders),
    orderUpdates: Boolean(formState.orderUpdates),
    reviewsAndRatings: Boolean(formState.reviewsAndRatings),
    promotionsAndTips: Boolean(formState.promotionsAndTips),
    emailNotifications: Boolean(formState.emailNotifications),
    smsEnabled: Boolean(formState.smsEnabled),
  };
}

export async function fetchClientSettingsProfile() {
  const response = await graphqlRequest({
    query: GET_CLIENT_SETTINGS_PROFILE_QUERY,
  });

  if (!response?.me) {
    throw new Error("Unable to load client settings.");
  }

  return mapClientSettingsProfileToFormState(response.me);
}

export async function updateClientSettingsProfile(formState) {
  const response = await graphqlRequest({
    query: UPDATE_CLIENT_SETTINGS_MUTATION,
    variables: {
      input: {
        notificationPreferences: buildNotificationPreferencesInput(formState),
      },
    },
  });

  const result = response?.generalProfileUpdate;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to update notification settings.");
  }

  return {
    message: result.message || "Notification settings updated successfully.",
    formState: mergeClientSettingsFormState(
      formState,
      mapClientSettingsProfileToFormState(result.user),
    ),
  };
}
