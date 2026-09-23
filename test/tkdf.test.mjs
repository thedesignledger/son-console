// TKDF-256 against Corpus D1 Appendix W section W.7.10: the nine canonical
// conformance vectors, one per domain commitment, and the seal derivation
// against the published tkdf256 1.0.1 reference implementation.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tkdf256, TKDF_DOMAINS, float64be, uint32be, uint64be, hash32, deriveHeritage, deriveSeal, schemaASealHash, sha256Text } from '../engine.mjs';

const fill = (byte) => new Uint8Array(32).fill(byte);
const Z = fill(0x00), O = fill(0x01), F = fill(0xff), S = float64be(0.8);

const W7_10 = [
  ['TKDF:HER', [hash32('1ed80be5bdf906eb259b04e9331fe4ec0cb3bc01aed5dbfb0bf9016c521825ea'), hash32('c68d5bb2a8759ea332f642c6758d82ebbf8f0d6826f4182103b9a81a2b8f5af8'), float64be(0.9497)], 'c8041da8bbde4afe00906e6d0efb64300f90d2755b92b7835a736281fb179136'],
  ['TKDF:LIN', [Z, O, S], '9260e2d8403acba67336b1fe9dc0681f94727c35b93fe43bc51773e39027463d'],
  ['TKDF:DID', [Z, O, S], '1bb0c4a45b37d7072105d98a4de05e8237da4f8df63f7e0f54c07aafb2b28701'],
  ['TKDF:FLX', [Z, O, S], 'def015d5fc6556a7f14401f979fb6bb94873459d8e5ad48deb016308ea157969'],
  ['TKDF:GOV', [Z, O, S, F], '826b1fe915d2b9de510f9c254d8b9e8ac9c02a025058d5ef4b0f516d9a67e916'],
  ['TKDF:DAT', [Z, O, S], '3083170a574244de510e85ca4dc0827a8e13794073eb56c4b29261602bd86797'],
  ['TKDF:ZKT', [Z, O, S], '3b7f8a3f1cb4e0e331e04dc71152dccdf59e4e12ea772eb5980b00315d3830f7'],
  ['TKDF:SWP', [Z, O, S], 'd4d528c0a8b5aac3154875bb695882a07f49e639593aa6f4ce53a7b31bcf2e21'],
  ['TKDF:LOCK', [Z, O, S], 'b9b05fffe01fe7d3eaf2fb51c9623319d1ec5836525ef9391310510d0e5b87bf'],
];

for (const [domain, fields, expected] of W7_10) {
  test(`W.7.10 conformance vector ${domain}`, async () => {
    assert.equal(await tkdf256(fields, domain), expected);
  });
}

test('the nine domain commitments, and only those', async () => {
  assert.deepEqual(Object.values(TKDF_DOMAINS).sort(), W7_10.map(([d]) => d).sort());
  await assert.rejects(tkdf256([Z], 'TKDF:XYZ'), RangeError);
  await assert.rejects(tkdf256([Z], 'tkdf:her'), RangeError);
});

test('fields are fixed width, so no two field tuples share a preimage', async () => {
  await assert.rejects(tkdf256([new Uint8Array(31)], TKDF_DOMAINS.DAT), RangeError);
  await assert.rejects(tkdf256([new Uint8Array(33)], TKDF_DOMAINS.DAT), RangeError);
  await assert.rejects(tkdf256(['00'.repeat(32)], TKDF_DOMAINS.DAT), RangeError);
  await assert.rejects(tkdf256([], TKDF_DOMAINS.DAT), RangeError);
  assert.throws(() => float64be(NaN), RangeError);
  assert.throws(() => float64be(Infinity), RangeError);
  assert.throws(() => uint32be(-1), RangeError);
  assert.throws(() => uint32be(2 ** 32), RangeError);
  assert.throws(() => uint64be(-1n), RangeError);
  assert.throws(() => hash32('abc'), RangeError);
  assert.equal(uint64be(2n ** 64n - 1n).length, 8);
});

test('the Genesis Anchor recomputes through deriveHeritage (section IX.3.0.1)', async () => {
  assert.equal(await deriveHeritage('1ed80be5bdf906eb259b04e9331fe4ec0cb3bc01aed5dbfb0bf9016c521825ea',
    'c68d5bb2a8759ea332f642c6758d82ebbf8f0d6826f4182103b9a81a2b8f5af8', 0.9497),
  'c8041da8bbde4afe00906e6d0efb64300f90d2755b92b7835a736281fb179136');
});

test('deriveSeal equals derive_seal of the tkdf256 1.0.1 reference implementation', async () => {
  // values computed with the published Python package, tkdf256 1.0.1 on PyPI
  assert.equal(await deriveSeal('00'.repeat(32), '01'.repeat(32), 0.8, 'ff'.repeat(32)),
    'ea311c5cfb1a7c530f819c1d099ae02ea28c97155e2f75b02e499ae80519c37c');
  assert.equal(await deriveSeal('ab'.repeat(32), 'cd'.repeat(32), 0.9497, 'ef'.repeat(32)),
    '167d5491a5f2a32626a44148cde6d1e2015e00d77104c2239b9d53eb4a3101ab');
  await assert.rejects(deriveSeal('00'.repeat(32), '01'.repeat(32), 1.2, 'ff'.repeat(32)), RangeError);
});

test('Schema A is the raw pre-cutover digest, kept for recomputing old seals only', async () => {
  assert.equal(await schemaASealHash('a', 'b', 0.9, 1, 'op'), await sha256Text('ab0.91op'));
  // the ambiguity that retired it: different tuples, one preimage
  assert.equal(await schemaASealHash('ab', 'c', 0.9, 1, 'op'), await schemaASealHash('a', 'bc', 0.9, 1, 'op'));
});
