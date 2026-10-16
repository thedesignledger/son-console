```
                             ._*$$$*_.
                          .*$%*.   .*$$*.
                        _%$*.         .*$%.
                       %$%               %$%
                      $$*    ._*%%%*_.    *$$
                     *$$__%%%*".   ."*%%%__$$*
                   _*$$$$%.             .%$$$$*_
                _%$*"$$*"*%$%*_.   ._*%$%*"*$$"*$%_
             .%$%.   $$*     ."*$$$*".     *$%   .%$%.
            *$%      $$*        %$%        *$%      %$*
           $$*       %$%_.      %$%      ._%$%       *$$
          %$%          ."*%%%__ %$% __%$%*".          %$%
          $$%_.             .*%$$$$$%*.             ._%$$
            ""*%%%%%%%%%%%%%%**". ."**%%%%%%%%%%%%%%*""

                 T H E   D E S I G N   L E D G E R
                 =================================

2020-2026 | Powered by CTP/IP: Causal Time Protocol / Intentional Processing
       Architect: [E.L] - [ ΔΣ₀Γ = DSZG  Delta Sigma Zero Gamma ] Coherence Networks
                    DOI 10.5281/zenodo.21950371 | contact@designledger.co
```

# son-console

**Self-guarding engineering kernel for the Causal Time Protocol / Intentional Processing.**

The repo doesn't just implement the protocol. It *is* the protocol.

---

## What This Is, and What It Isn't

**son-console is the open-source kernel.** It contains the canonical engine, `engine.mjs`: one file holding the physics (Γ, ctu, thresholds, the evaluation), TKDF-256, the seal derivation, the Genesis Seal and CausalAnchor, and the Guardian Gate predicate, so its SHA-256 covers every line of protocol logic. Anyone can clone it, inspect the equations, verify the protocol. The falsification tests are published. The protocol is verifiable.

**LUX Runtime is the commercial product.** LUX is the full orchestration engine, the production seal pipeline, operator profiles, Fractal Fabric DAG, ZK-TSL certificates, ΔGENCY certification, CVF, telemetry channels, and sector deployment infrastructure. LUX is built on the physics defined here but is licensed separately through Design Ledger.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  son-console (open · CC BY-NC 4.0)                  │
│  ├── engine.mjs         The canonical engine        │
│  ├── lib/               Re-exports, display helpers │
│  ├── guardian-gates.mjs  Five Guardian Gates         │
│  ├── test/              Fixtures, TKDF, anchors     │
│  └── GitHub Actions      LUX Runtime on PRs                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  LUX Runtime (licensed · designledger.co)            │
│  ├── Full ΔΣ₀Γ seal pipeline                        │
│  ├── Operator management & profiles                 │
│  ├── Fractal Fabric DAG                             │
│  ├── ZK-TSL certificate generation                  │
│  ├── ΔGENCY certification (Phases 0-4)              │
│  ├── CVF, 9.5 percent of validated emission         │
│  ├── Telemetry channels (E, V, A)                   │
│  └── Sector deployments (AI, Education, Finance,    │
│       Gaming, Governance, Science)                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

son-console gives away the physics. LUX sells the infrastructure.

---

## Install

```bash
git clone https://github.com/thedesignledger/son-console.git
cd son-console
```

No dependencies.

---

## Canonical Physics

From `lib/physics.mjs`, the constants that both son-console and LUX Runtime build on.

| Constant | Value | Source |
|----------|-------|--------|
| φ (PHI) | 1.618033988749895 | Book I §I.6.2 |
| Λ_L (LAMBDA_LUX) | 8.987551787368177 × 10¹⁶ | Book I §I.6.1 |
| λ_reg (EPSILON_0) | 1.0 | Book I §I.7.1 |
| Γ_min (SEED) | 0.70 | Book I §I.7.2 |
| Γ_B (BLOOM) | 0.8187 | Book I §I.7.2 |
| Γ_R (ROOT) | 0.95 | Book I §I.7.2 |

**Γ = (E × V × A) / (τ + λ_reg)**

---

## Repository Structure

```
son-console/
├── engine.mjs                 ← The canonical engine: physics, TKDF-256, seals, anchors, gate predicate
├── lib/
│   ├── physics.mjs           ← Re-exports the engine; display and Lux helpers
│   ├── guardian-gates.mjs     ← Five Guardian Gates evaluation
│   ├── lux-runtime.mjs        ← Re-exports the gate predicate
│   ├── crypto.mjs             ← Re-exports TKDF-256 and the seal derivation
│   └── genesis-gate.mjs       ← Re-exports the Genesis Seal and CausalAnchor
├── test/                      ← npm test: fixtures, bounds, TKDF-256, anchors, gates
├── bin/
│   └── eva.mjs                ← The engine bridge: E V A in, verdict out
├── .github/workflows/
│   └── lux-runtime.yml        ← npm test on push and PR
├── FALSIFICATION.md
├── LICENSE
├── package.json
└── README.md
```

---

## Verify the Engine

```bash
npm test
```

Runs the twenty fixtures of Corpus D1 Appendix M (Γ to 1e-9, class, verdict, ctu), the Appendix M section M.3.1 bounds (a value outside its domain is refused, never clamped), the nine TKDF-256 conformance vectors of Appendix W section W.7.10, the seal derivation against the published `tkdf256` reference implementation, the Ed25519 CausalAnchor (every field bound, a revoked anchor refused), the Genesis calibration state (never sealable), and the Git gates end to end in throwaway repositories. It also checks that `engine.mjs` imports nothing, so its SHA-256 is the hash of all protocol logic:

```bash
sha256sum engine.mjs
```

The engine inscribed on chain is commit `206545a` of this repository, `engine.mjs` SHA-256 `040e14ea0a11ec3565f7994e6b5ae7054b67194438c0cc5fa551d38fc98880f1` (FC-1, Solana slot 419,487,383). The corpus reproduces its twenty fixtures against that commit (Appendix M section M.7). This release, 10.0.0, is a different file with a different hash; it computes the same Γ, class, verdict and ctu on all twenty, and `npm test` proves it. The inscribed engine itself is held byte for byte at `Production/sdks/son-console` and vendored by every importer on the estate (`vendor/ctpip-engine`, guarded by hash on every build). Do not present this release's hash as the inscribed one.

---

## Production Architecture

| Layer | System | What It Does |
|-------|--------|-------------|
| **Law** | CTP/IP canonical corpus (DOI: 10.5281/zenodo.21950371) | Defines the protocol |
| **Kernel** | son-console (this repo) | Proves the physics |
| **Engine** | LUX Runtime (licensed) | Production seal pipeline, operator management, Fractal Fabric |
| **Standards** | time.foundation | Education, certification (SEED, BLOOM, ROOT), research |
| **Runtime** | designledger.co | Commercial operator platform, ΔGENCY certification, sector deployments |
| **Proof** | sovereign-mesh-proof | Working dashboard, CausalGraph, coherence-gated messaging |

**To inspect the physics:** clone this repo.
**To operate commercially:** the LUX Runtime licence, through designledger.co.
**To certify:** apply through time.foundation.

Boot file for any agent working here: `POLARIS.md`. The law it points at: `Production/polaris/RULINGS.md`.

---

## License

**son-console** is licensed under CC BY-NC 4.0, non-commercial use with attribution.


**LUX Runtime** commercial deployment requires a separate license from Design Ledger.

**Anti-weaponization:** This protocol must not be used for surveillance, coercion, social credit systems, weapons, or any system that extracts coherence from operators. See LICENSE for full terms. Violations are irrevocable.

---

**DOI:** 10.5281/zenodo.21950371
**Corpus:** CTP/IP canonical corpus (sealed)
**Author:** Érico Lisbôa, the Architect
**Standards:** The Time Foundation (time.foundation)
**Runtime:** Design Ledger (designledger.co)
