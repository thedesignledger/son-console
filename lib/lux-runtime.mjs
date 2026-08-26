// LUX Runtime - Client-side validation engine
// LUX Runtime — Book III Part E (Engineering Kernel)
// Authority: The Book of Causal Time v9.0.0

import { THRESHOLDS, computeGamma, classify, generateCTU } from './physics.mjs';
import { sha256Text } from './crypto.mjs';

// LUX Violation - thrown when Guardian Gates reject a transformation
export class LUXViolation extends Error {
  constructor(message) {
    super(`LUX VIOLATION: ${message}`);
    this.name = 'LUXViolation';
  }
}

// Full metric calculation for a transformation
export function calculateMetrics(E, V, A, tau = 0) {
  const E_n = Math.max(0, Math.min(1, E));
  const V_n = Math.max(0, Math.min(1, V));
  const A_n = Math.max(0, Math.min(1, A));

  const Gamma = computeGamma(E_n, V_n, A_n, tau);
  const coherenceDeficit = 1 - Gamma;
  const valid = Gamma >= THRESHOLDS.GAMMA_MIN;
  // L2796: REJECTED means no CTU generated. L4969: Gamma=0.69 gets ZERO, not 69%.
  const CTU = valid ? generateCTU(E_n, V_n, A_n) : 0;

  return {
    Gamma,
    coherenceDeficit,
    deltaS: coherenceDeficit, // deprecated alias
    CTU,
    classification: classify(Gamma),
  };
}

// Guardian Gate verification (L0 Section 5 - binary VALID/INVALID)
// Accepts both coherenceDeficit (canonical) and deltaS (deprecated) for backward compat
export function verify(metrics, options = {}) {
  const { Gamma, coherenceDeficit, deltaS } = metrics;
  const deficit = coherenceDeficit ?? deltaS; // prefer canonical, fall back to deprecated
  const { isGenesis = false } = options;
  const violations = [];

  const coherenceValid = Gamma >= THRESHOLDS.GAMMA_MIN;
  if (!coherenceValid) {
    violations.push(`Coherence Index (Gamma=${Gamma.toFixed(4)}) < ${THRESHOLDS.GAMMA_MIN}`);
  }

  const entropyValid = deficit > 0;
  if (!entropyValid) {
    violations.push(`Entropy (coherenceDeficit=${deficit.toFixed(4)}) must be > 0`);
  }

  const passed = violations.length === 0;

  // Genesis immunity: genesis engine cannot self-block during calibration
  if (!passed && isGenesis) {
    return {
      passed: true,
      verdict: 'GENESIS_CALIBRATION',
      violations,
      coherenceValid,
      entropyValid,
      Gamma,
      coherenceDeficit: deficit,
      deltaS: deficit, // deprecated alias
    };
  }

  if (!passed) {
    throw new LUXViolation(violations.join('; '));
  }

  return {
    passed: true,
    verdict: 'VALID',
    violations: [],
    coherenceValid,
    entropyValid,
    Gamma,
    coherenceDeficit: deficit,
    deltaS: deficit, // deprecated alias
  };
}

// Generate ZK-TSL (replaces deprecated ZK-PoT)
export async function generateZKTSL(sealHash, gamma, timestamp) {
  return sha256Text(`${sealHash}${gamma}${timestamp}`);
}