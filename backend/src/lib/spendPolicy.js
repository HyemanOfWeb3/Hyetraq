/**
 * Pure spend-policy helper. This does not execute or authorize a payment by itself.
 * The caller must obtain a current, validated quote and request user approval.
 */
export function checkSpendCap({ quotedUsd, spentUsd = 0, maxSpendUsd }) {
  const values = [quotedUsd, spentUsd, maxSpendUsd];
  if (values.some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
    return { allowed: false, reason: 'invalid-amount' };
  }
  const remainingUsd = Math.max(0, Number((maxSpendUsd - spentUsd).toFixed(8)));
  if (quotedUsd > remainingUsd) {
    return { allowed: false, reason: 'cap-exceeded', remainingUsd };
  }
  return { allowed: true, reason: 'within-cap', remainingUsd, projectedSpendUsd: Number((spentUsd + quotedUsd).toFixed(8)) };
}
