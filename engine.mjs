#!/usr/bin/env node

/**
 * Son Console v9.0.0 - Deterministic Engine Binary
 * CTP/IP Canonical Kernel
 * 
 * Built: May 13, 2026
 * 
 * This is the canonical engine binary for R3 FC-1 deployment.
 * SHA-256 hash of this binary is recorded in the engine attestation.
 */

// Core physics engine
import { computeGamma, classify, generateCTU, evaluateEVA } from './lib/physics.mjs';
import { createGenesisSeal, createCausalAnchor, verifyAnchor } from './lib/genesis-gate.mjs';
import { sha256Text, combinedSealHash } from './lib/crypto.mjs';
import { calculateMetrics, verify, generateZKTSL } from './lib/lux-runtime.mjs';

// Version metadata
export const ENGINE_VERSION = '9.0.0';
export const BUILD_TYPE = 'canonical';
export const PROTOCOL = 'CTP/IP';

// Main engine interface
export const SonConsole = {
  version: ENGINE_VERSION,
  physics: {
    computeGamma,
    classify,
    generateCTU,
    evaluateEVA
  },
  genesis: {
    createGenesisSeal,
    createCausalAnchor,
    verifyAnchor
  },
  crypto: {
    sha256Text,
    combinedSealHash
  },
  runtime: {
    calculateMetrics,
    verify,
    generateZKTSL
  }
};

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`CTP/IP Son Console v${ENGINE_VERSION}`);
  console.log(`Build: ${BUILD_TYPE}`);
  console.log(`Protocol: ${PROTOCOL}`);
  console.log();
  console.log('Canonical physics formula: Γ = (E × V × A) / (τ + ε₀)');
  console.log('Genesis Heritage Spark canonical Γ: 0.9497 (BLOOM)');
  console.log();
  console.log('This is the R3 canonical engine binary for FC-1 deployment.');
}

export default SonConsole;