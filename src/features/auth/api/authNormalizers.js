export function normalizeRegisterUserInput(input) {
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

export function normalizeLoginUserInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: input.role ?? "user",
  };
}

export function normalizeForgotPasswordInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    role: input.role ?? "user",
  };
}

export function normalizeVerifyResetCodeInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    pin: `${input.pin ?? ""}`.trim(),
  };
}

export function normalizeResetPasswordInput(input) {
  return {
    email: input.email.trim().toLowerCase(),
    token: `${input.token ?? ""}`.trim(),
    password1: input.password1,
    password2: input.password2,
  };
}
