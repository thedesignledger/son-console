// The Genesis Seal and CausalAnchor: signed with Ed25519, verified by
// recomputing the Genesis hash from the anchor's own fields and checking the
// signature against the public key it carries. A flag is never consulted.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateAnchorKeys, createGenesisSeal, createCausalAnchor, verifyAnchor, sha256Text } from '../engine.mjs';

const T = 1778682104000;

async function fresh() {
  const keys = await generateAnchorKeys();
  const seal = await createGenesisSeal('agency-001', 'first-commitment', keys, T);
  return { keys, seal, anchor: createCausalAnchor(seal) };
}

test('an anchor made from a signed Genesis Seal verifies', async () => {
  const { seal, anchor } = await fresh();
  assert.equal(seal.hash, await sha256Text(`GENESIS:agency-001:first-commitment:${T}`));
  assert.match(seal.publicKey, /^[0-9a-f]{64}$/);
  assert.match(seal.signature, /^[0-9a-f]{128}$/);
  assert.deepEqual(await verifyAnchor(anchor), { valid: true });
});

test('every field is bound: changing any one fails verification', async () => {
  const { anchor } = await fresh();
  for (const [key, value] of [['operatorId', 'agency-002'], ['commitment', 'other'], ['timestamp', T + 1],
    ['genesisHash', '0'.repeat(64)], ['signature', '0'.repeat(128)]]) {
    const r = await verifyAnchor({ ...anchor, [key]: value });
    assert.equal(r.valid, false, key);
  }
});

test("another agency's key cannot vouch for this anchor", async () => {
  const { anchor } = await fresh();
  const other = await fresh();
  const r = await verifyAnchor({ ...anchor, publicKey: other.anchor.publicKey });
  assert.equal(r.valid, false);
});

test('a flag proves nothing: an unsigned object marked sovereign fails', async () => {
  const r = await verifyAnchor({ sovereign: true, genesisHash: 'a'.repeat(64), operatorId: 'x', commitment: 'y', timestamp: 1 });
  assert.equal(r.valid, false);
  assert.equal((await verifyAnchor(null)).valid, false);
});

test('a revoked anchor fails Gate 3 (fixture-013)', async () => {
  const { anchor } = await fresh();
  const revokedKeys = new Set([anchor.publicKey]);
  const r = await verifyAnchor(anchor, { revoked: (a) => revokedKeys.has(a.publicKey) });
  assert.deepEqual(r, { valid: false, reason: 'Anchor revoked' });
});

test('the Genesis preimage is unambiguous: fields may not carry the separator', async () => {
  const keys = await generateAnchorKeys();
  await assert.rejects(createGenesisSeal('a:b', 'c', keys, T), RangeError);
  await assert.rejects(createGenesisSeal('a', '', keys, T), RangeError);
  await assert.rejects(createGenesisSeal('a', 'c', keys, -1), RangeError);
  await assert.rejects(createGenesisSeal('a', 'c', null, T), TypeError);
});
