// CTP/IP digests and TKDF-256. The functions live in ../engine.mjs, the file
// that holds all protocol logic; this module re-exports them.
//
// deriveSeal is the canonical seal (TKDF-256, the FC-8 cutover).
// schemaASealHash recomputes seals made before that cutover and nothing else.
export {
  sha256Text, sha256File, tkdf256, TKDF_DOMAINS, float64be, uint32be, uint64be, hash32,
  deriveHeritage, deriveSeal, schemaASealHash,
} from '../engine.mjs';
