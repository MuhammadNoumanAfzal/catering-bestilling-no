import { graphqlRequest } from "../../../lib/api/graphqlClient";
import { uploadMenuImage } from "../../menu/api/menuUploadApi";
import {
  mapClientSettingsProfileToFormState,
  mergeClientSettingsFormState,
} from "./clientSettingsMappers";
import {
  REMOVE_MY_AVATAR_MUTATION,
  UPDATE_CLIENT_NOTIFICATION_SETTINGS_MUTATION,
  UPDATE_MY_AVATAR_MUTATION,
} from "./clientSettingsMutations";
import { GET_CLIENT_SETTINGS_PROFILE_QUERY } from "./clientSettingsQueries";

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function buildNotificationSettingsInput(formState) {
  return {
    emailEnabled: Boolean(formState.emailEnabled),
    smsEnabled: Boolean(formState.smsEnabled),
    pushEnabled: Boolean(formState.pushEnabled),
  };
}

export async function fetchClientSettingsProfile() {
  const response = await graphqlRequest({
    query: GET_CLIENT_SETTINGS_PROFILE_QUERY,
  });

  if (!response?.me) {
    throw new Error("Unable to load client settings.");
  }

  return mapClientSettingsProfileToFormState({
    user: response.me,
    notificationSettings: response.userNotificationSettings || {},
  });
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
      mapClientSettingsProfileToFormState({
        user: formState,
        notificationSettings: result.settings,
      }),
    ),
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

export async function uploadClientAvatar(file, currentFormState) {
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
    formState: mergeClientSettingsFormState(
      currentFormState,
      mapClientSettingsProfileToFormState({
        user: {
          ...currentFormState,
          ...result.user,
        },
        notificationSettings: currentFormState,
      }),
    ),
  };
}

export async function removeClientAvatar(currentFormState) {
  const response = await graphqlRequest({
    query: REMOVE_MY_AVATAR_MUTATION,
  });

  const result = response?.removeMyAvatar;

  if (!result?.user?.id) {
    throw new Error(result?.message || "Unable to remove profile photo.");
  }

  return {
    message: result.message || "Profile photo removed successfully.",
    formState: mergeClientSettingsFormState(
      currentFormState,
      mapClientSettingsProfileToFormState({
        user: {
          ...currentFormState,
          ...result.user,
          avatarUpdatedAt: "",
        },
        notificationSettings: currentFormState,
      }),
    ),
  };
}
