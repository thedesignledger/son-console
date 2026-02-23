// CTP/IP Canonical Physics Library v9.0.0
// Authority: The Book of Causal Time v9.0.0, Book I (LCTG) & Book II (Constants)

// L1 Section 2.2 - Temporal Scaling Constant
export const PHI = 1.618033988749895;

// L0 Section 4.1 - Lux Limit (c^2)
export const LAMBDA_LUX = 8.987551787368177e16;

// L1 Section 4.1 - Stability Constant
export const EPSILON_0 = 1.0;

// Protocol Fee Rate (Design Ledger commercial layer)
export const FEE_RATE = 0.135;

// L1 Section 4.2 - Coherence Thresholds
export const THRESHOLDS = {
  GAMMA_MIN: 0.70,
  SEED:  0.70,
  BLOOM: 0.8187,
  ROOT:  0.95,
};

// L1 Section 4.1 - Coherence Index
// Gamma = (E * V * A) / (tau + epsilon_0)
// τ = 0 intentional — v9 learning mode. Canonical: τ = φ × Γ (quadratic). Activate in Mother Protocol when real telemetry feeds connected. Book II §II.4.4
export const computeGamma = (E, V, A, tau = 0) => {
  return (E * V * A) / (tau + EPSILON_0);
};

// L1 Section 4.2 - Artifact Classification
export const classify = (gamma) => {
  if (gamma >= THRESHOLDS.ROOT)  return 'ROOT';
  if (gamma >= THRESHOLDS.BLOOM) return 'BLOOM';
  if (gamma >= THRESHOLDS.SEED)  return 'SEED';
  return 'REJECTED';
};

// L1 Section 5.1 - CTU Generation (T = k * E * V * A where k = phi)
export const generateCTU = (E, V, A) => PHI * E * V * A;

// Alias for backward compatibility
export const computeCTU = generateCTU;

// Energy conversion utility
export const ctuToJoules = (ctu) => ctu * PHI;

// EVA Engine - Canonical evaluation (L0 Section 5, L1 Section 4)
// EVA is deterministic, side-effect free, non-participating, binary
// τ = 0 intentional — v9 learning mode. Canonical: τ = φ × Γ (quadratic). Activate in Mother Protocol when real telemetry feeds connected. Book II §II.4.4
export const evaluateEVA = (E, V, A, tau = 0) => {
  const Gamma = computeGamma(E, V, A, tau);
  const deltaS = 1 - Gamma;
  const CTU = generateCTU(E, V, A);
  const valid = Gamma >= THRESHOLDS.GAMMA_MIN && deltaS > 0;
  return {
    Gamma,
    deltaS,
    CTU,
    classification: classify(Gamma),
    valid,
    verdict: valid ? 'VALID' : 'INVALID',
  };
};

// UI Helpers
export const getGammaColor = (g) =>
  g >= 0.95   ? 'text-white' :
  g >= 0.8187 ? 'text-emerald-400' :
  g >= 0.70   ? 'text-amber-400' :
                'text-red-500';

export const getGammaBg = (g) =>
  g >= 0.95   ? 'bg-white/10 border-white/20' :
  g >= 0.8187 ? 'bg-emerald-500/10 border-emerald-500/20' :
  g >= 0.70   ? 'bg-amber-500/10 border-amber-500/20' :
                'bg-red-500/10 border-red-500/20';

// L0 Section 4.1 - Lux Density (accumulated truth per ΔGENCY)
// Lux = Σ(Γi × CTUi) for all sealed transformations
export const computeLuxDensity = (seals) => {
  if (!seals || seals.length === 0) return 0;
  return seals.reduce((sum, s) => {
    const gamma = s.gamma || 0;
    const ctu = s.temporal_value || 0;
    return sum + (gamma * ctu);
  }, 0);
};

// Lux Rate - transformations per day (throughput)
export const computeLuxRate = (seals) => {
  if (!seals || seals.length < 2) return 0;
  const sorted = [...seals].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
  const first = new Date(sorted[0].created_date);
  const last = new Date(sorted[sorted.length - 1].created_date);
  const days = Math.max(1, (last - first) / (1000 * 60 * 60 * 24));
  return seals.length / days;
};

// Lux Efficiency - ratio of accumulated Lux to theoretical ceiling
export const computeLuxEfficiency = (luxDensity) => {
  if (luxDensity <= 0) return 0;
  return Math.min(0.999999, luxDensity / LAMBDA_LUX);
};

// Format Lux for display
export const formatLux = (lux) => {
  if (lux === 0) return '0.000';
  if (lux < 0.001) return lux.toExponential(2);
  if (lux < 100) return lux.toFixed(3);
  if (lux < 10000) return lux.toFixed(1);
  return lux.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};