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
