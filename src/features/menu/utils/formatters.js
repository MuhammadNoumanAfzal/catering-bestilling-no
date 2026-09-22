export function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDistance(addressLine = "") {
  const firstDigit = addressLine.match(/\d+/)?.[0];

  if (!firstDigit) {
    return "2.1 km away";
  }

  return `${(Number(firstDigit) / 4).toFixed(1)} km away`;
}
