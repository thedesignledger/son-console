// Guardian Gates - Client-side pre-validation
// Canonical: EVA Engine is binary (VALID/INVALID), deterministic, non-participating
// Authority: Book III Part A, Book IV §IV.A.3

import { THRESHOLDS } from './physics.mjs';

// Pre-validate before submitting to server
// Returns { canSeal, gates, reason }
// Accepts both coherenceDeficit (canonical) and deltaS (deprecated) for backward compat
export function evaluateGates({ Gamma, coherenceDeficit, deltaS, intentHash, evidenceHash, anchorIds }) {
  const deficit = coherenceDeficit ?? deltaS; // prefer canonical, fall back to deprecated
  if (typeof Gamma !== 'number' || !(Gamma >= 0 && Gamma <= 1)) throw new RangeError('Gamma must be a number in [0, 1]');
  if (typeof deficit !== 'number' || !Number.isFinite(deficit)) throw new RangeError('coherenceDeficit must be a finite number');
  const gates = {
    coherence:  { passed: Gamma >= THRESHOLDS.GAMMA_MIN, value: Gamma, threshold: THRESHOLDS.GAMMA_MIN },
    entropy:    { passed: deficit > 0, value: deficit },
    intent:     { passed: !!intentHash && intentHash.length === 64, value: intentHash ? 'HASHED' : 'MISSING' },
    evidence:   { passed: !!evidenceHash && evidenceHash.length === 64, value: evidenceHash ? 'HASHED' : 'MISSING' },
    anchors:    { passed: Array.isArray(anchorIds) && anchorIds.length > 0, value: anchorIds?.length || 0 },
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