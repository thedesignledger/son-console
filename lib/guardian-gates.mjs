// Guardian Gates - Client-side pre-validation
// Canonical: EVA Engine is binary (VALID/INVALID), deterministic, non-participating
// Authority: Book III Part A, Book IV §IV.A.3

import { THRESHOLDS } from './physics.mjs';

// Pre-validate before submitting to server
// Returns { canSeal, gates, reason }
export function evaluateGates({ Gamma, deltaS, intentHash, evidenceHash, anchorIds }) {
  const gates = {
    coherence:  { passed: Gamma >= THRESHOLDS.GAMMA_MIN, value: Gamma, threshold: THRESHOLDS.GAMMA_MIN },
    entropy:    { passed: deltaS > 0, value: deltaS },
    intent:     { passed: !!intentHash && intentHash.length === 64, value: intentHash ? 'HASHED' : 'MISSING' },
    evidence:   { passed: !!evidenceHash && evidenceHash.length === 64, value: evidenceHash ? 'HASHED' : 'MISSING' },
    anchors:    { passed: anchorIds && anchorIds.length > 0, value: anchorIds?.length || 0 },
  };

  const allPassed = Object.values(gates).every(g => g.passed);
  const failedGate = Object.entries(gates).find(([_, g]) => !g.passed);

  return {
    canSeal: allPassed,
    gates,
    reason: allPassed
      ? 'All Guardian Gates passed'
      : `Gate failed: ${failedGate[0]}`,
  };
}

export function getGateColor(passed) {
  return passed ? 'text-emerald-400' : 'text-red-500';
}

export function getGateIcon(passed) {
  return passed ? '✓' : '✗';
}