#!/usr/bin/env node
// eva.mjs . the engine bridge, and nothing else.
//
// The only job here is to reach the canonical engine rather than restate it.
// gamma-check.mjs computes E, V and A locally and says so in its own header;
// this file does not compute physics at all. It reads three observables and
// hands them to evaluateEVA from engine.mjs, the canonical engine.
//
//   node bin/eva.mjs <E> <V> <A> [tau]
//
// Output is one JSON line. No thresholds are applied here and nothing is
// refused: the verdict is reported, never enforced. Enforcement belongs to a
// Human Agency, and while the derivation from context to E, V and A is open,
// enforcing on it would promote an interpretation to an operational claim.

import { SonConsole, ENGINE_VERSION } from '../engine.mjs';

const [, , e, v, a, t] = process.argv;

if (e === undefined) {
  console.error('usage: node bin/eva.mjs <E> <V> <A> [tau]');
  process.exit(2);
}

// Inputs are refused when outside their domain, never clamped: a clamp would
// hand the engine a number the adapter never measured.
const E = Number(e), V = Number(v), A = Number(a);
const tau = t === undefined ? 0 : Number(t);

let r;
try {
  r = SonConsole.physics.evaluateEVA(E, V, A, tau);
} catch (err) {
  console.error(err.message);
  process.exit(2);
}

process.stdout.write(JSON.stringify({
  engine: ENGINE_VERSION,
  source: 'engine.mjs evaluateEVA, the canonical engine',
  inputs: { E, V, A, tau },
  gamma: r.Gamma,
  coherenceDeficit: r.coherenceDeficit,
  ctu: r.CTU,
  classification: r.classification,
  verdict: r.verdict,
}) + '\n');
