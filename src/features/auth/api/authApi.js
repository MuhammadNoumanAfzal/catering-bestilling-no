import { graphqlRequest } from "../../../lib/api/graphqlClient";
import {
  buildRegisterUserMutation,
  buildLoginUserMutation,
  buildPasswordResetMailMutation,
  buildVerifyResetCodeMutation,
  buildResetPasswordMutation,
} from "./authMutations";
import {
  normalizeRegisterUserInput,
  normalizeLoginUserInput,
  normalizeForgotPasswordInput,
  normalizeVerifyResetCodeInput,
  normalizeResetPasswordInput,
} from "./authNormalization";

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
