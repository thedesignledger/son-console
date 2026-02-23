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
  const deltaS = 1 - Gamma;
  const CTU = generateCTU(E_n, V_n, A_n);

  return {
    Gamma,
    deltaS,
    CTU,
    classification: classify(Gamma),
  };
}

// Guardian Gate verification (L0 Section 5 - binary VALID/INVALID)
export function verify(metrics, options = {}) {
  const { Gamma, deltaS } = metrics;
  const { isGenesis = false } = options;
  const violations = [];

  const coherenceValid = Gamma >= THRESHOLDS.GAMMA_MIN;
  if (!coherenceValid) {
    violations.push(`Coherence Index (Gamma=${Gamma.toFixed(4)}) < ${THRESHOLDS.GAMMA_MIN}`);
  }

  const entropyValid = deltaS > 0;
  if (!entropyValid) {
    violations.push(`Entropy (deltaS=${deltaS.toFixed(4)}) must be > 0`);
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
      deltaS,
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
    deltaS,
  };
}

// Generate ZK-TSL (replaces deprecated ZK-PoT)
export async function generateZKTSL(sealHash, gamma, timestamp) {
  return sha256Text(`${sealHash}${gamma}${timestamp}`);
}