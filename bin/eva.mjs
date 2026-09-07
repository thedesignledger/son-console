#!/usr/bin/env node
// eva.mjs . the engine bridge, and nothing else.
//
// The only job here is to reach the inscribed engine rather than restate it.
// gamma-check.mjs computes E, V and A locally and says so in its own header;
// this file does not compute physics at all. It reads three observables and
// hands them to evaluateEVA from engine.mjs, whose SHA-256 is the one inscribed
// on chain at Solana slot 419,487,383.
//
//   node bin/eva.mjs <E> <V> <A> [tau]
//
// Output is one JSON line. No thresholds are applied here and nothing is
// refused: the verdict is reported, never enforced. Enforcement belongs to a
// Human Agency, and while the derivation from context to E, V and A is open,
// enforcing on it would promote an interpretation to an operational claim.

import { SonConsole, ENGINE_VERSION } from '../engine.mjs';

const [, , e, v, a, t] = process.argv;
const num = (x, d) => {
  const n = Number(x);
  return Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : d;
};

if (e === undefined) {
  console.error('usage: node bin/eva.mjs <E> <V> <A> [tau]');
  process.exit(2);
}

const E = num(e, 0), V = num(v, 0), A = num(a, 0);
const tau = Number.isFinite(Number(t)) ? Number(t) : 0;

const r = SonConsole.physics.evaluateEVA(E, V, A, tau);

process.stdout.write(JSON.stringify({
  engine: ENGINE_VERSION,
  source: 'engine.mjs evaluateEVA, the inscribed engine',
  inputs: { E, V, A, tau },
  gamma: r.Gamma,
  coherenceDeficit: r.coherenceDeficit,
  ctu: r.CTU,
  classification: r.classification,
  verdict: r.verdict,
}) + '\n');
