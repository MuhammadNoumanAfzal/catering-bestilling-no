import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import {
  mergeSettingsFormState,
  mapSettingsProfileToFormState,
} from "./profileSettingsMappers";
import { buildGeneralProfileUpdateMutation } from "./profileSettingsMutations";
import { GET_SETTINGS_PROFILE_QUERY } from "./profileSettingsQueries";

export async function fetchSettingsProfile() {
  const response = await graphqlRequest({ query: GET_SETTINGS_PROFILE_QUERY });

  if (!response?.me) {
    throw new Error("Unable to load settings profile.");
  }

  return mapSettingsProfileToFormState(response.me);
}

export async function updateSettingsProfile(formState) {
  const query = buildGeneralProfileUpdateMutation(formState);
  const response = await graphqlRequest({ query });
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
