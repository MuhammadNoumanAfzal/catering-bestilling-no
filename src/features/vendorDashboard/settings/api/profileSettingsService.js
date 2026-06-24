import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import {
  mergeSettingsFormState,
  mapSettingsProfileToFormState,
} from "./profileSettingsMappers";
import { UPDATE_GENERAL_PROFILE_MUTATION } from "./profileSettingsMutations";
import { GET_SETTINGS_PROFILE_QUERY } from "./profileSettingsQueries";

function buildNotificationPreferences(formState) {
  return {
    deliveryUpdates: {
      textMessage: Boolean(formState.textNotifications),
      email: Boolean(formState.emailNotifications),
      pushNotification: Boolean(formState.pushNotifications),
    },
    orderConfirmation: {
      pushNotification: Boolean(formState.orderConfirmationPush),
    },
  };
}

function buildGeneralProfileVariables(formState) {
  return {
    firstName: `${formState.firstName ?? ""}`.trim(),
    lastName: `${formState.lastName ?? ""}`.trim(),
    phone: `${formState.mobilePhone ?? ""}`.trim(),
    workPhone: `${formState.workPhone ?? ""}`.trim(),
    secondaryEmail: `${formState.secondaryEmail ?? ""}`.trim(),
    companyName: `${formState.company ?? ""}`.trim(),
    jobTitle: `${formState.jobTitle ?? ""}`.trim(),
    industryUsage: `${formState.industry ?? ""}`.trim(),
    notificationPreferences: buildNotificationPreferences(formState),
  };
}

export async function fetchSettingsProfile() {
  const response = await graphqlRequest({ query: GET_SETTINGS_PROFILE_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load settings profile.");
  }

  return mapSettingsProfileToFormState(response.me);
}

export async function updateSettingsProfile(formState) {
  const response = await graphqlRequest({
    query: UPDATE_GENERAL_PROFILE_MUTATION,
    variables: buildGeneralProfileVariables(formState),
  });
  const result = response?.generalProfileUpdate;

  if (!result?.success) {
    throw new Error(result?.message || "Unable to update profile settings.");
  }

  return {
    message: result.message || "Profile updated successfully",
    formState: mergeSettingsFormState(
      formState,
      mapSettingsProfileToFormState(result.user),
    ),
  };
}
