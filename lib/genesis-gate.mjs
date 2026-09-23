// Genesis Gate, Book IV Part B: the Genesis Seal and the CausalAnchor.
// The functions live in ../engine.mjs, the file that holds all protocol logic.
// An anchor verifies by recomputation and an Ed25519 signature, never by a flag.
export { generateAnchorKeys, createGenesisSeal, createCausalAnchor, verifyAnchor } from '../engine.mjs';
