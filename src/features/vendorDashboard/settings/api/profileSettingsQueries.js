export const GET_SETTINGS_PROFILE_QUERY = `
  query GetSettingsProfile {
    me {
      id
      firstName
      lastName
      email
      phone
      workPhone
      secondaryEmail
      companyName
      jobTitle
      industryUsage
      notificationPreferences
    }
  }
`;
