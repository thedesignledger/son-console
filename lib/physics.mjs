// CTP/IP physics. The protocol functions live in ../engine.mjs, the file whose
// SHA-256 is inscribed; this module re-exports them and adds display and
// statistics helpers that make no protocol claim.

export {
  PHI, EPSILON_0, LAMBDA_LUX, FEE_RATE, THRESHOLDS,
  computeGamma, classify, generateCTU, evaluateEVA,
} from '../engine.mjs';
import { PHI, LAMBDA_LUX } from '../engine.mjs';
import { generateCTU } from '../engine.mjs';

// Alias for backward compatibility
export const computeCTU = generateCTU;

// Energy conversion utility
export const ctuToJoules = (ctu) => ctu * PHI;

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

// Lux Density (accumulated truth per Human Agency): Lux = Σ(Γi × CTUi)
export const computeLuxDensity = (seals) => {
  if (!seals || seals.length === 0) return 0;
  return seals.reduce((sum, s) => {
    const gamma = s.gamma || 0;
    const ctu = s.temporal_value || 0;
    return sum + (gamma * ctu);
  }, 0);
};

// Lux Rate: transformations per day (throughput)
export const computeLuxRate = (seals) => {
  if (!seals || seals.length < 2) return 0;
  const sorted = [...seals].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
  const first = new Date(sorted[0].created_date);
  const last = new Date(sorted[sorted.length - 1].created_date);
  const days = Math.max(1, (last - first) / (1000 * 60 * 60 * 24));
  return seals.length / days;
};

// Lux Efficiency: ratio of accumulated Lux to the Lux Limit
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
