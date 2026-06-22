export function formatCurrency(value) {
  return Number(value).toFixed(2);
}

export function formatDistance(addressLine = "") {
  const firstDigit = addressLine.match(/\d+/)?.[0];

  if (!firstDigit) {
    return "2.1 km away";
  }

  return `${(Number(firstDigit) / 4).toFixed(1)} km away`;
}
