import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  mapClientSettingsProfileToFormState,
  mergeClientSettingsFormState,
} from "./clientSettingsMappers";
import {
  CREATE_AVATAR_UPLOAD_URL_MUTATION,
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

function buildSignedUploadHeaders(headers = []) {
  return headers.reduce((accumulator, item) => {
    if (item?.key) {
      accumulator[item.key] = item?.value || "";
    }
    return accumulator;
  }, {});
}

async function uploadAvatarBinary(uploadUrl, headers, file) {
  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        ...headers,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Unable to upload the selected image.");
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Image upload could not reach the storage service. Please verify the signed upload URL method and storage CORS settings.",
      );
    }

    throw error;
  }
}

export async function uploadClientAvatar(file, currentFormState) {
  validateAvatarFile(file);

  const uploadResponse = await graphqlRequest({
    query: CREATE_AVATAR_UPLOAD_URL_MUTATION,
    variables: {
      input: {
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      },
    },
  });

  const uploadConfig = uploadResponse?.createAvatarUploadUrl;

  if (!uploadConfig?.uploadUrl || !uploadConfig?.fileUrl) {
    throw new Error("Unable to prepare image upload.");
  }

  await uploadAvatarBinary(
    uploadConfig.uploadUrl,
    buildSignedUploadHeaders(uploadConfig.headers),
    file,
  );

  const response = await graphqlRequest({
    query: UPDATE_MY_AVATAR_MUTATION,
    variables: {
      input: {
        avatarUrl: uploadConfig.fileUrl,
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
