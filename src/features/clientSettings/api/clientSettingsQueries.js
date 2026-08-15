export const GET_CLIENT_SETTINGS_PROFILE_QUERY = `
  query GetClientSettingsProfile {
    me {
      id
      firstName
      lastName
      fullName
      email
      phone
      avatarUrl
      avatarThumbnailUrl
      avatarUpdatedAt
      profileCompletionPercent
    }
    userNotificationSettings {
      smsEnabled
      emailEnabled
      pushEnabled
    }
  }
`;
