export const UPDATE_CLIENT_NOTIFICATION_SETTINGS_MUTATION = `
  mutation UpdateUserNotificationSettings($input: UserNotificationSettingsInput!) {
    updateUserNotificationSettings(input: $input) {
      success
      message
      settings {
        smsEnabled
        emailEnabled
        pushEnabled
      }
    }
  }
`;

export const CREATE_AVATAR_UPLOAD_URL_MUTATION = `
  mutation CreateAvatarUploadUrl($input: CreateAvatarUploadUrlInput!) {
    createAvatarUploadUrl(input: $input) {
      method
      uploadUrl
      fileUrl
      fileKey
      expiresIn
      headers {
        key
        value
      }
    }
  }
`;

export const UPDATE_MY_AVATAR_MUTATION = `
  mutation UpdateMyAvatar($input: UpdateMyAvatarInput!) {
    updateMyAvatar(input: $input) {
      user {
        id
        avatarUrl
        avatarThumbnailUrl
        avatarUpdatedAt
        profileCompletionPercent
      }
      message
    }
  }
`;

export const REMOVE_MY_AVATAR_MUTATION = `
  mutation RemoveMyAvatar {
    removeMyAvatar {
      user {
        id
        avatarUrl
        avatarThumbnailUrl
        profileCompletionPercent
      }
      message
    }
  }
`;
