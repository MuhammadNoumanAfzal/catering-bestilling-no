export const GET_CLIENT_NOTIFICATION_SETTINGS_QUERY = `
  query GetUserNotificationSettings {
    userNotificationSettings {
      smsEnabled
      emailEnabled
      pushEnabled
    }
  }
`;
