import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  CHANGE_PASSWORD_MUTATION,
  LOGOUT_USER_MUTATION,
  LOGIN_USER_MUTATION,
  PASSWORD_RESET_MAIL_MUTATION,
  REGISTER_USER_MUTATION,
  RESET_PASSWORD_MUTATION,
  VERIFY_RESET_CODE_MUTATION,
} from "./authMutations";
import {
  normalizeForgotPasswordInput,
  normalizeLoginUserInput,
  normalizeRegisterUserInput,
  normalizeResetPasswordInput,
  normalizeVerifyResetCodeInput,
} from "./authNormalizers";
import { normalizeAuthenticatedUser } from "../../../lib/auth/authSession";

function ensureSuccessResult(result, fallbackMessage) {
  if (!result?.success) {
    throw new Error(result?.message ?? fallbackMessage);
  }
}

function ensureActiveUser(user, contextLabel) {
  if (!user) {
    throw new Error(`${contextLabel} did not include a user object.`);
  }

  if (user.isActive === false) {
    throw new Error("This account is inactive. Please contact support.");
  }
}

function ensureAccessToken(accessToken, contextLabel) {
  const normalizedToken = `${accessToken ?? ""}`.trim();

  if (!normalizedToken) {
    throw new Error(`${contextLabel} did not include an access token.`);
  }

  return normalizedToken;
}

async function runAuthMutation({
  query,
  variables,
  dataKey,
  fallbackMessage,
  validate,
  mapResult,
}) {
  const data = await graphqlRequest({ query, variables });
  const result = data?.[dataKey];

  ensureSuccessResult(result, fallbackMessage);
  validate?.(result);

  return mapResult ? mapResult(result) : result;
}

export async function registerUser(input) {
  const variables = normalizeRegisterUserInput(input);

  return runAuthMutation({
    query: REGISTER_USER_MUTATION,
    variables,
    dataKey: "registerUser",
    fallbackMessage: "Registration failed.",
    validate: (result) => {
      if (!result?.user) {
        throw new Error("Registration response did not include a user object.");
      }
    },
    mapResult: (result) => ({
      ...result,
      user: normalizeAuthenticatedUser(result.user),
    }),
  });
}

export async function loginUser(input) {
  const variables = normalizeLoginUserInput(input);

  return runAuthMutation({
    query: LOGIN_USER_MUTATION,
    variables,
    dataKey: "loginUser",
    fallbackMessage: "Login failed.",
    validate: (result) => {
      ensureActiveUser(result?.user, "Login response");
      ensureAccessToken(result?.access, "Login response");
    },
    mapResult: (result) => ({
      ...result,
      access: ensureAccessToken(result.access, "Login response"),
      user: normalizeAuthenticatedUser(result.user),
    }),
  });
}

export async function passwordResetMail(input) {
  const variables = normalizeForgotPasswordInput(input);

  return runAuthMutation({
    query: PASSWORD_RESET_MAIL_MUTATION,
    variables,
    dataKey: "passwordResetMail",
    fallbackMessage: "Unable to send reset code.",
  });
}

export async function verifyResetCode(input) {
  const variables = normalizeVerifyResetCodeInput(input);

  return runAuthMutation({
    query: VERIFY_RESET_CODE_MUTATION,
    variables,
    dataKey: "verifyResetCode",
    fallbackMessage: "Unable to verify reset code.",
  });
}

export async function resetPassword(input) {
  const variables = normalizeResetPasswordInput(input);

  return runAuthMutation({
    query: RESET_PASSWORD_MUTATION,
    variables,
    dataKey: "resetPassword",
    fallbackMessage: "Unable to reset password.",
  });
}

export async function logoutUser() {
  return runAuthMutation({
    query: LOGOUT_USER_MUTATION,
    dataKey: "logoutUser",
    fallbackMessage: "Unable to log out right now.",
  });
}

export async function changePassword(input) {
  const variables = {
    oldPassword: `${input?.oldPassword ?? ""}`,
    newPassword1: `${input?.newPassword1 ?? ""}`,
    newPassword2: `${input?.newPassword2 ?? ""}`,
  };
  const data = await graphqlRequest({
    query: CHANGE_PASSWORD_MUTATION,
    variables,
  });
  const result = data?.changePassword;

  if (!result?.success) {
    const errorMessage = Array.isArray(result?.errors) && result.errors.length > 0
      ? result.errors
          .map((error) => error?.message)
          .filter(Boolean)
          .join(" ")
      : result?.message || "Unable to change password.";

    throw new Error(errorMessage);
  }

  return result;
}
