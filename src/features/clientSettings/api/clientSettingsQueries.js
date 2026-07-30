export const GET_CLIENT_SETTINGS_PROFILE_QUERY = `
  query GetClientSettingsProfile {
    me {
      id
      phone
      notificationPreferences
    }
  }
`;
