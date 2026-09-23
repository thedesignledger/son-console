#!/usr/bin/env node

/**
 * son-console 10.0.0, the canonical CTP/IP engine.
 *
 * One file, and no protocol code outside it. The SHA-256 of this file covers
 * every line of protocol logic the kernel executes:
 *
 *   physics   the measurement function of Corpus D1 Appendix M, section M.3.1,
 *             with its bounds checks, thresholds and ctu generation
 *   tkdf      TKDF-256 of Appendix W: fixed-width fields, one of nine domain
 *             commitments appended, SHA-256 over the whole preimage
 *   crypto    the canonical seal derivation, and the pre-cutover Schema A
 *             digest kept only to recompute seals made before FC-8
 *   genesis   the Genesis Seal and CausalAnchor, signed with Ed25519 and
 *             verified by recomputation, never by a flag
 *   runtime   the Guardian Gate predicate; a calibration result is never
 *             sealable
 *
 * lib/ re-exports from this file and adds display helpers only. The only
 * dependency is the platform's Web Crypto API (Node.js 22 or later, or any
 * browser with Ed25519 support).
 */

// ═══════════════════════════════════════════════════════
// Constants, Corpus D1 Book I and Book II
// ═══════════════════════════════════════════════════════
export const ENGINE_VERSION = '10.0.0';
export const BUILD_TYPE = 'canonical';
export const PROTOCOL = 'CTP/IP';

export const PHI = 1.618033988749895;          // k, the temporal scaling constant
export const EPSILON_0 = 1.0;                  // regularisation constant (lambda_reg)
export const LAMBDA_LUX = 8.987551787368177e16; // the Lux Limit
export const FEE_RATE = 0.095;                 // Cycle Validation Fee

export const THRESHOLDS = Object.freeze({
  GAMMA_MIN: 0.70,
  SEED: 0.70,
  BLOOM: 0.8187,
  ROOT: 0.95,
});

// ═══════════════════════════════════════════════════════
// Domains. A value outside its domain is refused, never clamped: a clamp
// would hide a broken adapter behind a plausible number.
// ═══════════════════════════════════════════════════════
function unitInterval(name, x) {
  if (typeof x !== 'number' || !(x >= 0 && x <= 1)) {
    throw new RangeError(`${name} must be a number in [0, 1], got ${String(x)}`);
  }
}

function friction(tau) {
  if (typeof tau !== 'number' || !Number.isFinite(tau) || tau < 0) {
    throw new RangeError(`tau must be a finite number in [0, Infinity), got ${String(tau)}`);
  }
}

// ═══════════════════════════════════════════════════════
// Physics, Appendix M section M.3.1
// ═══════════════════════════════════════════════════════
// Gamma = (E * V * A) / (tau + epsilon_0), bounded above by 1.
// tau = 0 is the v9 learning-mode setting; the canonical friction is
// tau = phi * Gamma (quadratic), per Book II section II.4.4.
export const computeGamma = (E, V, A, tau = 0) => {
  unitInterval('E', E);
  unitInterval('V', V);
  unitInterval('A', A);
  friction(tau);
  return Math.min(1, (E * V * A) / (tau + EPSILON_0));
};

export const classify = (gamma) => {
  unitInterval('Gamma', gamma);
  if (gamma >= THRESHOLDS.ROOT) return 'ROOT';
  if (gamma >= THRESHOLDS.BLOOM) return 'BLOOM';
  if (gamma >= THRESHOLDS.SEED) return 'SEED';
  return 'REJECTED';
};

// T = k * E * V * A, k = phi (Book II section II.5.1). The candidate value;
// evaluateEVA generates it only when the verdict is VALID.
export const generateCTU = (E, V, A) => {
  unitInterval('E', E);
  unitInterval('V', V);
  unitInterval('A', A);
  return PHI * E * V * A;
};

// Deterministic, side-effect free, no clock, no randomness (section M.3.2).
export const evaluateEVA = (E, V, A, tau = 0) => {
  const Gamma = computeGamma(E, V, A, tau);
  const coherenceDeficit = 1 - Gamma;
  const valid = Gamma >= THRESHOLDS.GAMMA_MIN && coherenceDeficit > 0;
  const CTU = valid ? generateCTU(E, V, A) : 0; // REJECTED means no ctu generated
  return {
    Gamma,
    gamma: Gamma,                 // the section M.3.1 field name
    coherenceDeficit,
    deltaS: coherenceDeficit,     // the section M.3.1 field name
    CTU,
    ctuGenerated: CTU,            // the section M.3.1 field name
    classification: classify(Gamma),
    valid,
    verdict: valid ? 'VALID' : 'INVALID',
  };
};

// ═══════════════════════════════════════════════════════
// Bytes and digests
// ═══════════════════════════════════════════════════════
const subtle = () => {
  const s = globalThis.crypto && globalThis.crypto.subtle;
  if (!s) throw new Error('the Web Crypto API is required (Node.js 22 or later)');
  return s;
};

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

function fromHex(hex, bytes, name) {
  if (typeof hex !== 'string' || !new RegExp(`^[0-9a-fA-F]{${bytes * 2}}$`).test(hex)) {
    throw new RangeError(`${name} must be ${bytes * 2} hexadecimal characters`);
  }
  const out = new Uint8Array(bytes);
  for (let i = 0; i < bytes; i++) out[i] = parseInt(hex.slice(2 * i, 2 * i + 2), 16);
  return out;
}

function concat(parts) {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}

async function sha256Bytes(bytes) {
  return toHex(new Uint8Array(await subtle().digest('SHA-256', bytes)));
}

export async function sha256Text(text) {
  return sha256Bytes(new TextEncoder().encode(text));
}

export async function sha256File(file) {
  return sha256Bytes(new Uint8Array(await file.arrayBuffer()));
}

// ═══════════════════════════════════════════════════════
// TKDF-256, Appendix W
// ═══════════════════════════════════════════════════════
export const TKDF_DOMAINS = Object.freeze({
  HER: 'TKDF:HER', LIN: 'TKDF:LIN', DID: 'TKDF:DID', FLX: 'TKDF:FLX', GOV: 'TKDF:GOV',
  DAT: 'TKDF:DAT', ZKT: 'TKDF:ZKT', SWP: 'TKDF:SWP', LOCK: 'TKDF:LOCK',
});
const DOMAIN_SET = new Set(Object.values(TKDF_DOMAINS));

export function float64be(x) {
  if (typeof x !== 'number' || !Number.isFinite(x)) throw new RangeError('a float64 field must be finite');
  const b = new Uint8Array(8);
  new DataView(b.buffer).setFloat64(0, x, false);
  return b;
}

export function uint32be(n) {
  if (!Number.isInteger(n) || n < 0 || n > 0xffffffff) throw new RangeError('a uint32 field must be an integer in [0, 2^32)');
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n, false);
  return b;
}

export function uint64be(n) {
  const v = typeof n === 'bigint' ? n : BigInt(n);
  if (v < 0n || v > 0xffffffffffffffffn) throw new RangeError('a uint64 field must be an integer in [0, 2^64)');
  const b = new Uint8Array(8);
  new DataView(b.buffer).setBigUint64(0, v, false);
  return b;
}

export const hash32 = (hex, name = 'hash') => fromHex(hex, 32, name);

// Every field is fixed width (a 32-byte hash, an 8-byte float64 or uint64, or a
// 4-byte uint32), so the concatenation is unambiguous without length prefixes;
// the domain commitment, appended last, separates the nine derivations.
export async function tkdf256(fields, domain) {
  if (!DOMAIN_SET.has(domain)) throw new RangeError(`unknown domain commitment: ${String(domain)}`);
  if (!Array.isArray(fields) || fields.length === 0) throw new RangeError('TKDF-256 takes at least one field');
  for (const f of fields) {
    if (!(f instanceof Uint8Array) || ![4, 8, 32].includes(f.length)) {
      throw new RangeError('TKDF-256 fields are fixed width: 32, 8 or 4 bytes');
    }
  }
  return sha256Bytes(concat([...fields, new TextEncoder().encode(domain)]));
}

// Genesis Anchor and heritage chain (section IX.3.0.1): evidence, anchor, Gamma.
export async function deriveHeritage(evidenceHex, anchorHex, gamma) {
  return tkdf256([hash32(evidenceHex, 'evidence'), hash32(anchorHex, 'anchor'), float64be(gamma)], TKDF_DOMAINS.HER);
}

// The canonical seal (FC-8 cutover), identical to derive_seal of the published
// tkdf256 reference implementation: IntentSig, evidence, Gamma, anchor.
export async function deriveSeal(intentSigHex, evidenceHex, gamma, anchorHex) {
  unitInterval('Gamma', gamma);
  return tkdf256([
    hash32(intentSigHex, 'IntentSig'), hash32(evidenceHex, 'evidence'),
    float64be(gamma), hash32(anchorHex, 'anchor'),
  ], TKDF_DOMAINS.DAT);
}

// Schema A, the production digest before the FC-8 cutover: raw SHA-256 over
// concatenated text with no framing and no domain commitment. It is kept only
// so a seal made before the cutover can be recomputed. It is not canonical and
// must not be used for a new seal.
export async function schemaASealHash(evidenceHash, intentHash, gamma, timestamp, operatorId) {
  return sha256Text(`${evidenceHash}${intentHash}${gamma.toString()}${timestamp.toString()}${operatorId}`);
}

// ═══════════════════════════════════════════════════════
// Genesis Seal and CausalAnchor, Book IV Part B
// ═══════════════════════════════════════════════════════
// The anchor is proved by an Ed25519 signature over the Genesis hash, checked
// against the public key the anchor carries, and by recomputing that hash from
// the anchor's own fields. A flag proves nothing and is not consulted.
const ED25519 = { name: 'Ed25519' };

function field(name, value) {
  if (typeof value !== 'string' || value.length === 0 || value.includes(':')) {
    throw new RangeError(`${name} must be a non-empty string without ':'`);
  }
}

function genesisPreimage(operatorId, commitment, timestamp) {
  field('operatorId', operatorId);
  field('commitment', commitment);
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) throw new RangeError('timestamp must be a non-negative integer');
  return `GENESIS:${operatorId}:${commitment}:${timestamp}`;
}

export async function generateAnchorKeys() {
  return subtle().generateKey(ED25519, true, ['sign', 'verify']);
}

// keys: an Ed25519 CryptoKeyPair held by the Human Agency. The private key never
// leaves the caller; the seal carries only the public key and the signature.
export async function createGenesisSeal(operatorId, commitment, keys, timestamp = Date.now()) {
  if (!keys || !keys.privateKey || !keys.publicKey) throw new TypeError('an Ed25519 key pair is required');
  const hash = await sha256Text(genesisPreimage(operatorId, commitment, timestamp));
  const signature = new Uint8Array(await subtle().sign(ED25519, keys.privateKey, fromHex(hash, 32, 'hash')));
  const publicKey = new Uint8Array(await subtle().exportKey('raw', keys.publicKey));
  return {
    type: 'GENESIS',
    operatorId,
    commitment,
    timestamp,
    hash,
    publicKey: toHex(publicKey),
    signature: toHex(signature),
  };
}

export function createCausalAnchor(genesisSeal) {
  return {
    operatorId: genesisSeal.operatorId,
    commitment: genesisSeal.commitment,
    timestamp: genesisSeal.timestamp,
    genesisHash: genesisSeal.hash,
    publicKey: genesisSeal.publicKey,
    signature: genesisSeal.signature,
    entropyDebt: 0,
    deltaState: 0, // Delta zero
  };
}

// revoked: an optional predicate over the anchor's public key or Genesis hash,
// backed by whatever record the deployment keeps (a revoked CausalAnchor fails
// Gate 3, fixture-013).
export async function verifyAnchor(anchor, { revoked } = {}) {
  if (!anchor || typeof anchor !== 'object') return { valid: false, reason: 'No anchor' };
  let expected;
  try {
    expected = await sha256Text(genesisPreimage(anchor.operatorId, anchor.commitment, anchor.timestamp));
  } catch (e) {
    return { valid: false, reason: `Malformed anchor: ${e.message}` };
  }
  if (anchor.genesisHash !== expected) return { valid: false, reason: 'Genesis hash does not recompute from the anchor fields' };
  let ok = false;
  try {
    const key = await subtle().importKey('raw', fromHex(anchor.publicKey, 32, 'publicKey'), ED25519, false, ['verify']);
    ok = await subtle().verify(ED25519, key, fromHex(anchor.signature, 64, 'signature'), fromHex(expected, 32, 'hash'));
  } catch (e) {
    return { valid: false, reason: `Signature not verifiable: ${e.message}` };
  }
  if (!ok) return { valid: false, reason: 'Signature does not verify against the anchor public key' };
  if (typeof revoked === 'function' && (await revoked(anchor))) return { valid: false, reason: 'Anchor revoked' };
  return { valid: true };
}

// ═══════════════════════════════════════════════════════
// Runtime, Book III Part E: the Guardian Gate predicate
// ═══════════════════════════════════════════════════════
export class LUXViolation extends Error {
  constructor(message) {
    super(`LUX VIOLATION: ${message}`);
    this.name = 'LUXViolation';
  }
}

// Inputs outside [0, 1] are refused, never clamped.
export function calculateMetrics(E, V, A, tau = 0) {
  const r = evaluateEVA(E, V, A, tau);
  return {
    Gamma: r.Gamma,
    coherenceDeficit: r.coherenceDeficit,
    deltaS: r.coherenceDeficit,
    CTU: r.CTU,
    classification: r.classification,
  };
}

// A passing transformation is sealable. A failing one throws, except during
// Genesis calibration, which may not block itself: that result reports
// GENESIS_CALIBRATION with passed and sealable both false, so no caller can
// read a calibration result as a seal.
export function verify(metrics, options = {}) {
  const { Gamma, coherenceDeficit, deltaS } = metrics || {};
  const deficit = coherenceDeficit ?? deltaS;
  const { isGenesis = false } = options;
  unitInterval('Gamma', Gamma);
  if (typeof deficit !== 'number' || !Number.isFinite(deficit)) throw new RangeError('coherenceDeficit must be a finite number');

  const violations = [];
  const coherenceValid = Gamma >= THRESHOLDS.GAMMA_MIN;
  if (!coherenceValid) violations.push(`Coherence Index (Gamma=${Gamma.toFixed(4)}) < ${THRESHOLDS.GAMMA_MIN}`);
  const entropyValid = deficit > 0;
  if (!entropyValid) violations.push(`Entropy (coherenceDeficit=${deficit.toFixed(4)}) must be > 0`);
  const passed = violations.length === 0;
  const common = { violations, coherenceValid, entropyValid, Gamma, coherenceDeficit: deficit, deltaS: deficit };

  if (!passed && isGenesis) {
    return { passed: false, sealable: false, calibration: true, verdict: 'GENESIS_CALIBRATION', ...common };
  }
  if (!passed) throw new LUXViolation(violations.join('; '));
  return { passed: true, sealable: true, calibration: false, verdict: 'VALID', ...common };
}

// ═══════════════════════════════════════════════════════
// Engine interface
// ═══════════════════════════════════════════════════════
export const SonConsole = Object.freeze({
  version: ENGINE_VERSION,
  physics: { computeGamma, classify, generateCTU, evaluateEVA },
  tkdf: { tkdf256, deriveHeritage, deriveSeal, TKDF_DOMAINS, float64be, uint32be, uint64be, hash32 },
  genesis: { generateAnchorKeys, createGenesisSeal, createCausalAnchor, verifyAnchor },
  crypto: { sha256Text, sha256File, deriveSeal, schemaASealHash },
  runtime: { calculateMetrics, verify, LUXViolation },
});

if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  console.log(`CTP/IP son-console v${ENGINE_VERSION}, ${BUILD_TYPE} engine`);
  console.log('Gamma = (E x V x A) / (tau + epsilon_0), Corpus D1 Appendix M section M.3.1');
}

export default SonConsole;
