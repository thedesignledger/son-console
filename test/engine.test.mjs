// The measurement function against Corpus D1 Appendix M: the twenty fixtures
// of sections M.4.2, M.5.2 and M.6.1, the section M.3.1 bounds, the
// thresholds, and determinism. The fixture files are the corpus's own
// VERIFY_PACK/fixtures/expected, copied here unchanged.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { SonConsole, computeGamma, classify, generateCTU, evaluateEVA, PHI, THRESHOLDS } from '../engine.mjs';

const dir = new URL('./fixtures/', import.meta.url);
const fixtures = readdirSync(dir).filter((f) => f.endsWith('.expected.json')).sort()
  .map((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')));

test('twenty fixtures, as Appendix M publishes them', () => {
  assert.equal(fixtures.length, 20);
});

for (const x of fixtures) {
  test(`${x.fixture_id}: ${x.description}`, () => {
    if (!x.expected_scalars) {
      assert.equal(x.expected_ctu, 0, 'a documented rejection generates no ctu');
      return;
    }
    const { E, V, A, tau } = x.expected_scalars;
    const r = SonConsole.physics.evaluateEVA(E, V, A, tau);
    assert.ok(Math.abs(r.Gamma - x.expected_gamma) <= x.tolerance, `Gamma ${r.Gamma} expected ${x.expected_gamma}`);
    assert.equal(r.Gamma.toFixed(10), x.expected_gamma_printed);
    assert.equal(r.classification, x.expected_classification);
    assert.equal(r.verdict, x.expected_verdict);
    if (x.expected_verdict === 'VALID') {
      assert.ok(Math.abs(Number(r.CTU.toFixed(3)) - x.expected_ctu) <= 0.0005);
    } else {
      assert.equal(r.CTU, 0, 'REJECTED means no ctu generated');
    }
    assert.equal(r.gamma, r.Gamma);
    assert.equal(r.ctuGenerated, r.CTU);
    assert.equal(r.deltaS, 1 - r.Gamma);
  });
}

test('section M.3.1 bounds: E, V and A outside [0, 1] are refused, never clamped', () => {
  for (const bad of [-0.01, 1.01, -1, 2, NaN, Infinity, -Infinity, '0.5', null, undefined, {}]) {
    assert.throws(() => computeGamma(bad, 0.5, 0.5), RangeError);
    assert.throws(() => computeGamma(0.5, bad, 0.5), RangeError);
    assert.throws(() => computeGamma(0.5, 0.5, bad), RangeError);
    assert.throws(() => evaluateEVA(bad, 0.5, 0.5), RangeError);
    assert.throws(() => generateCTU(bad, 0.5, 0.5), RangeError);
  }
});

test('section M.3.1 bounds: tau must be finite and not negative', () => {
  for (const bad of [-1, -0.0001, NaN, Infinity, '0', null]) {
    assert.throws(() => computeGamma(0.9, 0.9, 0.9, bad), RangeError);
  }
  assert.equal(computeGamma(1, 1, 1, 1), 0.5);
});

test('classification refuses a Gamma outside [0, 1]', () => {
  for (const bad of [-1, 1.0000001, 2, NaN, Infinity, '0.9']) {
    assert.throws(() => classify(bad), RangeError);
  }
});

test('thresholds are inclusive at SEED 0.70, BLOOM 0.8187 and ROOT 0.95', () => {
  assert.equal(classify(0), 'REJECTED');
  assert.equal(classify(0.6999999999), 'REJECTED');
  assert.equal(classify(THRESHOLDS.SEED), 'SEED');
  assert.equal(classify(0.8186999999), 'SEED');
  assert.equal(classify(THRESHOLDS.BLOOM), 'BLOOM');
  assert.equal(classify(0.9499999999), 'BLOOM');
  assert.equal(classify(THRESHOLDS.ROOT), 'ROOT');
  assert.equal(classify(1), 'ROOT');
});

test('Gamma = 1 leaves no coherence deficit, so the verdict is INVALID (section M.3.1)', () => {
  const r = evaluateEVA(1, 1, 1, 0);
  assert.equal(r.Gamma, 1);
  assert.equal(r.coherenceDeficit, 0);
  assert.equal(r.verdict, 'INVALID');
  assert.equal(r.CTU, 0);
});

test('ctu = k E V A with k = phi, generated only on a VALID verdict', () => {
  const r = evaluateEVA(0.9, 0.9, 0.9, 0);
  assert.equal(r.verdict, 'VALID');
  assert.equal(r.CTU, PHI * 0.9 * 0.9 * 0.9);
  assert.equal(evaluateEVA(0.5, 0.5, 0.5, 0).CTU, 0);
});

test('bit-exact determinism on identical inputs (section M.3.2)', () => {
  const a = evaluateEVA(0.8765, 0.9123, 0.9876, 0.0321);
  for (let i = 0; i < 1000; i++) assert.deepEqual(evaluateEVA(0.8765, 0.9123, 0.9876, 0.0321), a);
});
