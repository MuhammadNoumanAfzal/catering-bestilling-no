export function createCheckoutValidationError(availability, fallbackMessage) {
  const issues = (availability?.errors || []).filter((issue) => issue && typeof issue === "object");
  const messages = [...new Set(issues.map((issue) => issue.message).filter(Boolean))];
  const error = new Error(messages.length ? messages.join("\n") : fallbackMessage);
  error.code = issues[0]?.code || "CHECKOUT_VALIDATION_FAILED";
  error.field = issues[0]?.field || "";
  error.issues = issues;
  error.availability = availability;
  return error;
}

export function getCheckoutValidationFieldErrors(error) {
  const fields = new Set(["deliveryAddress", "deliveryPostalCode", "deliveryCity", "date", "time", "personCount"]);
  const aliases = { eventDate: "date", eventTime: "time" };
  return Object.fromEntries((error?.issues || []).flatMap((issue) => {
    const field = String(issue.field || "").replace(/^input\./, "");
    const target = aliases[field] || field;
    return fields.has(target) && issue.message ? [[target, issue.message]] : [];
  }));
}
