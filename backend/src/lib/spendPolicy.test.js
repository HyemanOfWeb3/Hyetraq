import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSpendCap } from './spendPolicy.js';

test('allows a quote that fits the remaining cap', () => {
  assert.deepEqual(checkSpendCap({ quotedUsd: 0.01, spentUsd: 0.02, maxSpendUsd: 0.05 }), {
    allowed: true, reason: 'within-cap', remainingUsd: 0.03, projectedSpendUsd: 0.03
  });
});

test('rejects a quote above the remaining cap', () => {
  assert.equal(checkSpendCap({ quotedUsd: 0.04, spentUsd: 0.02, maxSpendUsd: 0.05 }).reason, 'cap-exceeded');
});

test('rejects invalid or negative amounts', () => {
  assert.equal(checkSpendCap({ quotedUsd: NaN, spentUsd: 0, maxSpendUsd: 1 }).allowed, false);
  assert.equal(checkSpendCap({ quotedUsd: 0.01, spentUsd: -1, maxSpendUsd: 1 }).reason, 'invalid-amount');
});
