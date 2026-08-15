import { graphqlRequest } from "../../../../lib/api/graphqlClient";
import { uploadMenuImage } from "../../../menu/api/menuUploadApi";
import {
  mergeSettingsFormState,
  mapSettingsProfileToFormState,
} from "./profileSettingsMappers";
import { UPDATE_GENERAL_PROFILE_MUTATION } from "./profileSettingsMutations";
import { GET_SETTINGS_PROFILE_QUERY } from "./profileSettingsQueries";
import {
  REMOVE_MY_AVATAR_MUTATION,
  UPDATE_MY_AVATAR_MUTATION,
} from "../../../clientSettings/api/clientSettingsMutations";

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

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

function validateAvatarFile(file) {
  if (!file) {
    throw new Error("Please select an image to upload.");
  }

  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WEBP image.");
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    throw new Error("Please upload an image smaller than 5MB.");
  }
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

export async function uploadSettingsAvatar(file, currentFormState) {
  validateAvatarFile(file);
  const uploadResult = await uploadMenuImage(file);

  const response = await graphqlRequest({
    query: UPDATE_MY_AVATAR_MUTATION,
    variables: {
      input: {
        avatarUrl: uploadResult.fileUrl,
      },
    },
  });

  const result = response?.updateMyAvatar;

  if (!result?.user?.id) {
    throw new Error(result?.message || "Unable to save profile photo.");
  }

  return {
    message: result.message || "Profile photo updated successfully.",
    formState: mergeSettingsFormState(
      currentFormState,
      mapSettingsProfileToFormState({
        ...currentFormState,
        ...result.user,
        email: currentFormState.primaryEmail,
        phone: currentFormState.mobilePhone,
      }),
    ),
  };
}

export async function removeSettingsAvatar(currentFormState) {
  const response = await graphqlRequest({
    query: REMOVE_MY_AVATAR_MUTATION,
  });

  const result = response?.removeMyAvatar;

  if (!result?.user?.id) {
    throw new Error(result?.message || "Unable to remove profile photo.");
  }

  return {
    message: result.message || "Profile photo removed successfully.",
    formState: mergeSettingsFormState(
      currentFormState,
      mapSettingsProfileToFormState({
        ...currentFormState,
        ...result.user,
        email: currentFormState.primaryEmail,
        phone: currentFormState.mobilePhone,
        avatarUpdatedAt: "",
      }),
    ),
  };
}
