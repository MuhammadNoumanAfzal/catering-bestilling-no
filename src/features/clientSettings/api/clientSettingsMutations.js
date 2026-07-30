export const UPDATE_CLIENT_SETTINGS_MUTATION = `
  mutation GeneralProfileUpdate($input: UserProfileInput!) {
    generalProfileUpdate(input: $input) {
      success
      message
      user {
        id
        phone
        notificationPreferences
      }
    }
  }
`;
