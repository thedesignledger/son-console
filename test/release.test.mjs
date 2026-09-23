// The release is one hashed engine: engine.mjs imports nothing, every protocol
// function reached through lib/ is the engine's own, and the version and the
// build hash recorded in package.json and flake.nix agree with the file.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import * as engine from '../engine.mjs';
import * as physics from '../lib/physics.mjs';
import * as crypto from '../lib/crypto.mjs';
import * as genesis from '../lib/genesis-gate.mjs';
import * as runtime from '../lib/lux-runtime.mjs';

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url));

test('engine.mjs is self-contained: its hash covers all protocol logic', () => {
  const src = read('engine.mjs').toString();
  assert.doesNotMatch(src, /^\s*import\s/m);
  assert.doesNotMatch(src, /\bimport\s*\(/);
  assert.doesNotMatch(src, /\brequire\s*\(/);
});

test('lib/ re-exports the engine and holds no protocol logic of its own', () => {
  for (const name of ['computeGamma', 'classify', 'generateCTU', 'evaluateEVA', 'THRESHOLDS', 'PHI']) {
    assert.equal(physics[name], engine[name], name);
  }
  for (const name of ['sha256Text', 'tkdf256', 'deriveSeal', 'deriveHeritage', 'schemaASealHash']) {
    assert.equal(crypto[name], engine[name], name);
  }
  for (const name of ['generateAnchorKeys', 'createGenesisSeal', 'createCausalAnchor', 'verifyAnchor']) {
    assert.equal(genesis[name], engine[name], name);
  }
  for (const name of ['calculateMetrics', 'verify', 'LUXViolation']) {
    assert.equal(runtime[name], engine[name], name);
  }
  assert.equal(crypto.combinedSealHash, undefined, 'Schema A is not offered under a canonical name');
  assert.equal(runtime.generateZKTSL, undefined, 'a digest is not offered as a proof');
});

test('package.json and flake.nix agree with the engine', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.version, engine.ENGINE_VERSION);
  const flake = read('flake.nix').toString();
  const sha = createHash('sha256').update(read('engine.mjs')).digest('hex');
  assert.match(flake, new RegExp(`expectedSha256 = "${sha}"`));
  assert.match(flake, new RegExp(`version = "${engine.ENGINE_VERSION}"`));
});
