export const GET_SETTINGS_PROFILE_QUERY = `
  query GetSettingsProfile {
    me {
      id
      firstName
      lastName
      fullName
      email
      phone
      postCode
      workPhone
      secondaryEmail
      companyName
      jobTitle
      industryUsage
      avatarUrl
      avatarThumbnailUrl
      avatarUpdatedAt
      profileCompletionPercent
      notificationPreferences
    }
  }
`;
