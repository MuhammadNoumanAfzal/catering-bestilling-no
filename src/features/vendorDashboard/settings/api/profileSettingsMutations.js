function escapeGraphqlString(value) {
  return `${value ?? ""}`
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
}

function buildNotificationPreferencesInput(formState) {
  return `{
    deliveryUpdates: {
      textMessage: ${formState.textNotifications ? "true" : "false"}
      email: ${formState.emailNotifications ? "true" : "false"}
      pushNotification: ${formState.pushNotifications ? "true" : "false"}
    }
    orderConfirmation: {
      pushNotification: ${formState.orderConfirmationPush ? "true" : "false"}
    }
  }`;
}

export function buildGeneralProfileUpdateMutation(formState) {
  return `
    mutation UpdateGeneralProfile {
      generalProfileUpdate(input: {
        firstName: "${escapeGraphqlString(formState.firstName)}"
        lastName: "${escapeGraphqlString(formState.lastName)}"
        phone: "${escapeGraphqlString(formState.mobilePhone)}"
        workPhone: "${escapeGraphqlString(formState.workPhone)}"
        secondaryEmail: "${escapeGraphqlString(formState.secondaryEmail)}"
        companyName: "${escapeGraphqlString(formState.company)}"
        jobTitle: "${escapeGraphqlString(formState.jobTitle)}"
        industryUsage: "${escapeGraphqlString(formState.industry)}"
        notificationPreferences: ${buildNotificationPreferencesInput(formState)}
      }) {
        success
        message
        user {
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
    }
  `;
}
