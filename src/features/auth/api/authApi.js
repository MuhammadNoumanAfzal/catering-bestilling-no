import { graphqlRequest } from "../../../lib/api/graphqlClient";

function escapeGraphqlString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function buildRegisterUserMutation(input) {
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

function buildLoginUserMutation(input) {
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

function buildPasswordResetMailMutation(input) {
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

function buildVerifyResetCodeMutation(input) {
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

function buildResetPasswordMutation(input) {
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

function normalizeRegisterUserInput(input) {
  const postCode = Number.parseInt(`${input.postCode ?? ""}`.trim(), 10);
  const normalizedPhone = `${input.phone ?? ""}`.replace(/[^\d+]/g, "");

  if (Number.isNaN(postCode)) {
    throw new Error("Post code must be a valid number.");
  }

  if (!normalizedPhone.startsWith("+") || normalizedPhone.length < 8) {
    throw new Error("Phone number must include a valid country code.");
  }

  return {
    email: input.email.trim().toLowerCase(),
    phone: normalizedPhone,
    password: input.password,
    role: input.role ?? "user",
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    postCode,
  };
}

function normalizeLoginUserInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: input.role ?? "user",
  };
}

function normalizeForgotPasswordInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    role: input.role ?? "user",
  };
}

function normalizeVerifyResetCodeInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    pin: `${input.pin ?? ""}`.trim(),
  };
}

function normalizeResetPasswordInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    token: `${input.token ?? ""}`.trim(),
    password1: input.password1,
    password2: input.password2,
  };
}

async function runAuthMutation({
  query,
  dataKey,
  fallbackMessage,
  validate,
}) {
  const data = await graphqlRequest({ query });
  const result = data?.[dataKey];

  if (!result?.success) {
    throw new Error(result?.message ?? fallbackMessage);
  }

  validate?.(result);

  return result;
}

export async function registerUser(input) {
  const normalizedInput = normalizeRegisterUserInput(input);
  return runAuthMutation({
    query: buildRegisterUserMutation(normalizedInput),
    dataKey: "registerUser",
    fallbackMessage: "Registration failed.",
    validate: (result) => {
      if (!result?.user) {
        throw new Error("Registration response did not include a user object.");
      }
    },
  });
}

export async function loginUser(input) {
  const normalizedInput = normalizeLoginUserInput(input);
  return runAuthMutation({
    query: buildLoginUserMutation(normalizedInput),
    dataKey: "loginUser",
    fallbackMessage: "Login failed.",
    validate: (result) => {
      if (!result?.access || !result?.user) {
        throw new Error(
          "Login response did not include the expected session data.",
        );
      }
    },
  });
}

export async function passwordResetMail(input) {
  const normalizedInput = normalizeForgotPasswordInput(input);
  return runAuthMutation({
    query: buildPasswordResetMailMutation(normalizedInput),
    dataKey: "passwordResetMail",
    fallbackMessage: "Unable to send reset code.",
  });
}

export async function verifyResetCode(input) {
  const normalizedInput = normalizeVerifyResetCodeInput(input);
  return runAuthMutation({
    query: buildVerifyResetCodeMutation(normalizedInput),
    dataKey: "verifyResetCode",
    fallbackMessage: "Unable to verify reset code.",
  });
}

export async function resetPassword(input) {
  const normalizedInput = normalizeResetPasswordInput(input);
  return runAuthMutation({
    query: buildResetPasswordMutation(normalizedInput),
    dataKey: "resetPassword",
    fallbackMessage: "Unable to reset password.",
  });
}
