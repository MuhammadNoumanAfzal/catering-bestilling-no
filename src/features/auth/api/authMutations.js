export function escapeGraphqlString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

export function buildRegisterUserMutation(input) {
  return `
    mutation {
      registerUser(input: {
        email: "${escapeGraphqlString(input.email)}"
        phone: "${escapeGraphqlString(input.phone)}"
        password: "${escapeGraphqlString(input.password)}"
        role: "${escapeGraphqlString(input.role)}"
        firstName: "${escapeGraphqlString(input.firstName)}"
        lastName: "${escapeGraphqlString(input.lastName)}"
        postCode: ${input.postCode}
      }) {
        success
        message
        user {
          id
          email
        }
      }
    }
  `;
}

export function buildLoginUserMutation(input) {
  return `
    mutation LoginUser {
      loginUser(
        email: "${escapeGraphqlString(input.email)}"
        password: "${escapeGraphqlString(input.password)}"
        role: "${escapeGraphqlString(input.role)}"
      ) {
        success
        access
        user {
          id
          email
          firstName
          lastName
          role
          isActive
        }
      }
    }
  `;
}

export function buildPasswordResetMailMutation(input) {
  return `
    mutation {
      passwordResetMail(
        email: "${escapeGraphqlString(input.email)}",
        role: "${escapeGraphqlString(input.role)}"
      ) {
        success
        message
      }
    }
  `;
}

export function buildVerifyResetCodeMutation(input) {
  return `
    mutation {
      verifyResetCode(
        email: "${escapeGraphqlString(input.email)}",
        pin: "${escapeGraphqlString(input.pin)}"
      ) {
        success
        message
      }
    }
  `;
}

export function buildResetPasswordMutation(input) {
  return `
    mutation {
      resetPassword(
        email: "${escapeGraphqlString(input.email)}",
        token: "${escapeGraphqlString(input.token)}",
        password1: "${escapeGraphqlString(input.password1)}",
        password2: "${escapeGraphqlString(input.password2)}"
      ) {
        success
        message
      }
    }
  `;
}
