// Genesis Gate — Book IV Part B
// Genesis Seal generation & CausalAnchor verification
// Authority: The Book of Causal Time v9.0.0

import { sha256Text } from './crypto.mjs';

// Create Genesis Seal — the operator's first irreversible commitment
export async function createGenesisSeal(operatorId, commitment) {
  const timestamp = Date.now();
  const hash = await sha256Text(`GENESIS:${operatorId}:${commitment}:${timestamp}`);
  return {
    type: 'GENESIS',
    operatorId,
    commitment,
    timestamp,
    hash,
    sovereign: true,
  };
}

// Create CausalAnchor from Genesis Seal — binds identity to lineage
export function createCausalAnchor(genesisSeal) {
  return {
    operatorId: genesisSeal.operatorId,
    genesisHash: genesisSeal.hash,
    sovereign: true,
    entropyDebt: 0,
    deltaState: 0, // Δ₀
  };
}

// Verify anchor is valid and active
export function verifyAnchor(anchor) {
  if (!anchor) return { valid: false, reason: 'No anchor' };
  if (!anchor.sovereign) return { valid: false, reason: 'Not sovereign' };
  if (!anchor.genesisHash) return { valid: false, reason: 'No genesis hash' };
  return { valid: true };
}
