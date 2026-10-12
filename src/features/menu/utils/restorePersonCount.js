export function restorePersonCount(summary, minimumPersons) {
  const minimum = Math.max(1, Number(minimumPersons) || 1);
  if (!summary?.items?.length) return minimum;
  const saved = Number(summary.personCount);
  return Number.isSafeInteger(saved) ? Math.max(minimum, saved) : minimum;
}
