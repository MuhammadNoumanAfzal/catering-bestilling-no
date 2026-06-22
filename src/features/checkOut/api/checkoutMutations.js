function escapeGraphqlString(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}

function formatGraphqlValue(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatGraphqlValue(item)).join(", ")}]`;
  }

  if (value && typeof value === "object") {
    return `{ ${Object.entries(value)
      .map(([key, entryValue]) => `${key}: ${formatGraphqlValue(entryValue)}`)
      .join(", ")} }`;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? `${value}` : "0";
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  return `"${escapeGraphqlString(value)}"`;
}

export function buildPlaceClientOrderMutation(payload) {
  const args = Object.entries(payload)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `    ${key}: ${formatGraphqlValue(value)}`)
    .join("\n");

  return `
    mutation PlaceClientOrder {
      placeClientOrder(
${args}
      ) {
        success
        message
        orderId
      }
    }
  `;
}
