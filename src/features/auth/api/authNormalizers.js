import { AUTH_ROLE, PASSWORD_RESET_OTP_LENGTH } from "../constants/authForms";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const POST_CODE_PATTERN = /^\d+$/;

function requireNonEmptyString(value, label) {
  const normalizedValue = `${value ?? ""}`.trim();

  if (!normalizedValue) {
    throw new Error(`${label} is required.`);
  }

  return normalizedValue;
}

function normalizeEmail(value) {
  const email = requireNonEmptyString(value, "Email").toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  return email;
}

function normalizeRole(value) {
  const role = `${value ?? AUTH_ROLE}`.trim().toLowerCase();

  if (!role) {
    throw new Error("Account role is required.");
  }

  return role;
}

function normalizePassword(value, label = "Password") {
  const password = `${value ?? ""}`;

  if (!password.trim()) {
    throw new Error(`${label} is required.`);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `${label} must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
    );
  }

  return password;
}

function normalizePhoneNumber(value) {
  const normalizedPhone = `${value ?? ""}`.replace(/[^\d+]/g, "");

  if (!normalizedPhone.startsWith("+") || normalizedPhone.length < 8) {
    throw new Error("Phone number must include a valid country code.");
  }

  return normalizedPhone;
}

function normalizePostCode(value) {
  const postCode = requireNonEmptyString(value, "Post code");

  if (!POST_CODE_PATTERN.test(postCode)) {
    throw new Error("Post code must contain only digits.");
  }

  return Number.parseInt(postCode, 10);
}

export function normalizeRegisterUserInput(input) {
  return {
    email: normalizeEmail(input.email),
    phone: normalizePhoneNumber(input.phone),
    password: normalizePassword(input.password),
    role: normalizeRole(input.role),
    firstName: requireNonEmptyString(input.firstName, "First name"),
    lastName: requireNonEmptyString(input.lastName, "Last name"),
    postCode: normalizePostCode(input.postCode),
  };
}

export function normalizeLoginUserInput(input) {
  return {
    email: normalizeEmail(input.email),
    password: normalizePassword(input.password),
    role: normalizeRole(input.role),
  };
}

export function normalizeForgotPasswordInput(input) {
  return {
    email: normalizeEmail(input.email),
    role: normalizeRole(input.role),
  };
}

export function normalizeVerifyResetCodeInput(input) {
  const pin = requireNonEmptyString(input.pin, "Verification code");

  if (!new RegExp(`^\\d{${PASSWORD_RESET_OTP_LENGTH}}$`).test(pin)) {
    throw new Error(
      `Verification code must be ${PASSWORD_RESET_OTP_LENGTH} digits.`,
    );
  }

  return {
    email: normalizeEmail(input.email),
    pin,
  };
}

export function normalizeResetPasswordInput(input) {
  const password1 = normalizePassword(input.password1, "New password");
  const password2 = normalizePassword(input.password2, "Confirm password");

  if (password1 !== password2) {
    throw new Error("Passwords do not match.");
  }

  return {
    email: normalizeEmail(input.email),
    token: requireNonEmptyString(input.token, "Reset token"),
    password1,
    password2,
  };
}
