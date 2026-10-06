export function formatCurrency(value) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  const roundedAmount = Math.round(amount);

  if (Math.abs(amount - roundedAmount) < 0.005) {
    return new Intl.NumberFormat("nb-NO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  }

  return new Intl.NumberFormat("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}