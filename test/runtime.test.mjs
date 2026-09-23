// The Guardian Gate predicate: a passing transformation is sealable, a
// failing one throws, and a Genesis calibration result is never sealable.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verify, calculateMetrics, LUXViolation } from '../engine.mjs';
import { evaluateGates } from '../lib/guardian-gates.mjs';

test('a passing transformation is sealable', () => {
  const r = verify(calculateMetrics(0.9, 0.9, 0.9));
  assert.equal(r.passed, true);
  assert.equal(r.sealable, true);
  assert.equal(r.verdict, 'VALID');
});

test('a failing transformation throws a LUX violation', () => {
  assert.throws(() => verify(calculateMetrics(0.5, 0.5, 0.5)), LUXViolation);
  assert.throws(() => verify(calculateMetrics(1, 1, 1)), LUXViolation); // no coherence deficit
});

test('Genesis calibration never blocks itself and is never sealable', () => {
  for (const m of [calculateMetrics(0, 0, 0), calculateMetrics(0.5, 0.5, 0.5), { Gamma: 0, coherenceDeficit: 0 }]) {
    const r = verify(m, { isGenesis: true });
    assert.equal(r.verdict, 'GENESIS_CALIBRATION');
    assert.equal(r.passed, false);
    assert.equal(r.sealable, false);
    assert.equal(r.calibration, true);
    assert.ok(r.violations.length > 0);
  }
});

test('a passing Genesis cycle is an ordinary sealable result', () => {
  const r = verify(calculateMetrics(0.9, 0.9, 0.9), { isGenesis: true });
  assert.equal(r.sealable, true);
  assert.equal(r.verdict, 'VALID');
});

test('metrics outside the domain are refused, never clamped', () => {
  assert.throws(() => calculateMetrics(1.5, 0.9, 0.9), RangeError);
  assert.throws(() => calculateMetrics(0.9, -0.1, 0.9), RangeError);
  assert.throws(() => calculateMetrics(0.9, 0.9, 0.9, -1), RangeError);
  assert.throws(() => verify({ Gamma: 2, coherenceDeficit: -1 }), RangeError);
  assert.throws(() => verify({ Gamma: NaN, coherenceDeficit: 0.1 }), RangeError);
  assert.throws(() => verify({ Gamma: 0.9, coherenceDeficit: NaN }), RangeError);
});

test('client-side gates refuse a non-numeric Gamma', () => {
  assert.throws(() => evaluateGates({ Gamma: NaN, coherenceDeficit: 0.1 }), RangeError);
  const g = evaluateGates({ Gamma: 0.9, coherenceDeficit: 0.1, intentHash: 'a'.repeat(64), evidenceHash: 'b'.repeat(64), anchorIds: ['x'] });
  assert.equal(g.canSeal, true);
  assert.equal(evaluateGates({ Gamma: 0.9, coherenceDeficit: 0.1, intentHash: 'a'.repeat(64), evidenceHash: 'b'.repeat(64), anchorIds: 'x' }).canSeal, false);
});
