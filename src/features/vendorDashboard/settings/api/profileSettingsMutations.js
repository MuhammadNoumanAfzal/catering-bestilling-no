export const UPDATE_GENERAL_PROFILE_MUTATION = `
  mutation UpdateGeneralProfile(
    $firstName: String!
    $lastName: String!
    $phone: String!
    $postCode: Int!
    $workPhone: String!
    $secondaryEmail: String!
    $companyName: String!
    $jobTitle: String!
    $industryUsage: String!
    $notificationPreferences: GenericScalar!
  ) {
    generalProfileUpdate(
      input: {
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        postCode: $postCode
        workPhone: $workPhone
        secondaryEmail: $secondaryEmail
        companyName: $companyName
        jobTitle: $jobTitle
        industryUsage: $industryUsage
        notificationPreferences: $notificationPreferences
      }
    ) {
      success
      message
      user {
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
  }
`;
