export function isAuthAvailabilityError(error) {
  const code = `${error?.code || ""}`.toLowerCase();
  if (["unauthenticated", "unauthorized", "unauthorised", "forbidden", "auth_required"].includes(code)) return true;
  const message = `${error?.technicalMessage ?? error?.message ?? ""}`.toLowerCase();
  return /sign\s?in|log\s?in|authenticat|credentials|permission|unauthori[sz]ed|not (?:an? )?authorized|forbidden/.test(message);
}
