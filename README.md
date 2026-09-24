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

**Self-guarding engineering kernel for the Causal Time Protocol.**

son-console wires the Five Guardian Gates directly into Git's lifecycle. Every commit, push and merge is measured against them. In ENFORCE mode a low-coherence transformation is rejected before it enters the repository; in ADVISORY mode, the default for the Git adapter, the same result is reported and the work proceeds. The mode is printed on every run.

The repo doesn't just implement the protocol. It *is* the protocol.

---

## What This Is, and What It Isn't

**son-console is the open-source kernel.** It contains the canonical engine, `engine.mjs`: one file holding the physics (Γ, ctu, thresholds, the evaluation), TKDF-256, the seal derivation, the Genesis Seal and CausalAnchor, and the Guardian Gate predicate, so its SHA-256 covers every line of protocol logic. Around it sit the Five Guardian Gates and the Git hooks. Anyone can clone it, inspect the equations, verify the protocol, and use it to self-guard their own repos. The falsification tests are published. The protocol is verifiable.

**LUX Runtime is the commercial product.** LUX is the full orchestration engine, the production seal pipeline, operator profiles, Fractal Fabric DAG, ZK-TSL certificates, ΔGENCY certification, Stripe CVF, telemetry channels, and sector deployment infrastructure. LUX is built on the physics defined here but is licensed separately through Design Ledger PTY LTD.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  son-console (open · CC BY-NC 4.0)                  │
│  ├── engine.mjs         The canonical engine        │
│  ├── lib/               Re-exports, display helpers │
│  ├── guardian-gates.mjs  Five Guardian Gates         │
│  ├── 4 git hooks        Advisory or enforce         │
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
npm install    # hooks install automatically via prepare script
```

Or install into any existing repo:

```bash
./install-hooks.sh /path/to/your/repo
```

Every commit, push and merge is now Guardian Gate checked, in ADVISORY mode. To block on a failed gate:

```bash
git config ctpip.gates enforce      # this repository
CTPIP_GATES=enforce git commit ...  # one run
```

No dependencies.

---

## How It Works

The outcomes below are ENFORCE mode. In ADVISORY mode each one is measured and reported, and the operation proceeds.

```
Developer writes code
        │
        ▼
┌─ pre-commit hook ────────────────────────────┐
│  COHERENCE GATE                               │
│  Γ = (E × V × A) / (τ + ε₀)                │
│  E ← diff magnitude (lines changed)          │
│  V ← intent-to-scope alignment               │
│  A ← evidence quality (tests, lint, coverage) │
│  If Γ < 0.70 → COMMIT BLOCKED                │
│                                               │
│  EVIDENCE GATE                                │
│  SHA-256 hash of staged diff                  │
│  Empty diff → BLOCKED (ΔS must be > 0)       │
│                                               │
│  ANCHOR GATE                                  │
│  GPG/SSH signing key OR .son/operators match  │
│  No identity → BLOCKED                        │
└──────────────────────────────────────────────┘
        │ ✓ passed
        ▼
┌─ commit-msg hook ────────────────────────────┐
│  INTENT GATE                                  │
│  [INTENT] What this achieves                  │
│  [SCOPE] What it touches                      │
│  [CRITERIA] How to verify                     │
│  Empty/vague → BLOCKED                        │
│                                               │
│  ANTI-CIRCULARITY CHECK                       │
│  No forward hash references allowed           │
│  Self-referencing → BLOCKED                   │
└──────────────────────────────────────────────┘
        │ ✓ passed
        ▼
┌─ pre-push hook ──────────────────────────────┐
│  ENTROPY GATE                                 │
│  No empty commits in push range               │
│                                               │
│  TEMPORAL GATE                                │
│  No future timestamps                         │
│                                               │
│  ANTI-CIRCULARITY (full DAG)                  │
│  No commit references non-existent hashes     │
│                                               │
│  DAG Γ RE-VALIDATION                          │
│  Re-computes Γ for every commit in range      │
│  Low-Γ history → PUSH BLOCKED                 │
└──────────────────────────────────────────────┘
        │ ✓ passed
        ▼
┌─ pre-merge-commit hook ──────────────────────┐
│  CAUSAL HANDSHAKE                             │
│  [SYN]  Intent declared                       │
│  [DATA] Scope/evidence provided               │
│  [SEAL] Verification criteria stated          │
│  [FIN]  Result documented                     │
│  Missing SYN or DATA → MERGE BLOCKED          │
│                                               │
│  MERGE Γ CHECK                                │
│  Would merge create low-Γ parent?             │
│  If Γ < 0.70 → MERGE BLOCKED                 │
└──────────────────────────────────────────────┘
        │ ✓ passed
        ▼
┌─ GitHub Actions (LUX Runtime) ────────────────┐
│  Canonical constants verified in code         │
│  PR intent validated                          │
│  Tests/lint enforced                          │
│  Author anti-circularity (branch protection)  │
│  If any fail → MERGE BLOCKED                  │
└──────────────────────────────────────────────┘
        │ ✓ passed
        ▼
    Commit enters main
    (Fractal Fabric: the DAG is the ledger)
```

**Four lines of defense:**
1. **Git hooks** = Guardian Gates (local, instant, 4 hooks)
2. **LUX Runtime** = production orchestration (licensed, designledger.co)
3. **GitHub Actions** = LUX validation (remote, on PR)
4. **Commit DAG** = Fractal Fabric (permanent, immutable)

---

## Canonical Physics

From `lib/physics.mjs`, the constants that both son-console and LUX Runtime build on.

| Constant | Value | Source |
|----------|-------|--------|
| φ (PHI) | 1.618033988749895 | Book I §I.6.2 |
| Λ_L (LAMBDA_LUX) | 8.987551787368177 × 10¹⁶ | Book I §I.6.1 |
| ε₀ (EPSILON_0) | 1.0 | Book I §I.7.1 |
| Γ_min (SEED) | 0.70 | Book I §I.7.2 |
| Γ_B (BLOOM) | 0.8187 | Book I §I.7.2 |
| Γ_R (ROOT) | 0.95 | Book I §I.7.2 |

**Γ = (E × V × A) / (τ + ε₀)**

---

## Five Guardian Gates

| Gate | Hook | What It Checks | On Failure (ENFORCE) |
|------|------|----------------|------------|
| Coherence | pre-commit | Γ ≥ 0.70 from real diff/intent/evidence | Blocked + temporal debt |
| Intent | commit-msg | IntentSig structure + anti-circularity | Blocked |
| Entropy | pre-push | ΔS > 0 across all commits in push | Blocked |
| Evidence | pre-commit | SHA-256 hash of staged diff (64-char) | Blocked |
| Anchors | pre-commit | commit signing switched on (GPG or SSH), or the .son/operators registry | Blocked; an unsigned git identity is not an anchor |

Plus:
- **Temporal ordering** (pre-push), no future timestamps
- **Anti-circularity** (commit-msg + pre-push), no self-referencing or forward hash references
- **DAG Γ re-validation** (pre-push), re-computes Γ for every commit in push range
- **Causal Handshake** (pre-merge-commit), SYN/DATA/SEAL/FIN on merge
- **Merge Γ check** (pre-merge-commit), blocks low-coherence merge parents

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
├── hooks/
│   ├── pre-commit             ← Coherence + Evidence + Anchors
│   ├── commit-msg             ← Intent + Anti-Circularity
│   ├── pre-push               ← Entropy + Temporal + DAG Γ re-validation
│   └── pre-merge-commit       ← Causal Handshake + Merge Γ check
├── bin/
│   ├── gamma-check.mjs        ← Guardian Gate CLI (all hooks), Γ from engine.mjs
│   ├── eva.mjs                ← The engine bridge: E V A in, verdict out
│   └── setup-hooks.mjs        ← Auto-install on npm install
├── .github/workflows/
│   └── lux-runtime.yml        ← npm test and the Guardian Gates on push and PR
├── install-hooks.sh           ← Manual install for any repo
├── FALSIFICATION.md
├── LICENSE
├── package.json
└── README.md
```

---

## IntentSig Format (commit messages)

```
[INTENT] Add Guardian Gate pre-commit hook
[SCOPE] hooks/pre-commit, bin/gamma-check.mjs
[CRITERIA] Commit blocked when Γ < 0.70; structured output in terminal
```

Structured IntentSig gives higher V (Vector) → higher Γ → higher classification.
Plain messages accepted (minimum 10 chars) but produce lower V.

## Causal Handshake Format (merge messages)

```
[SYN] Merge feature/guardian-gates into main
[DATA] 4 files changed: hooks/*, bin/gamma-check.mjs
[SEAL] All 5 falsification tests pass, Γ > 0.80
[FIN] Guardian Gates enforced on all commits
```

SYN + DATA required. SEAL + FIN raise merge coherence.

---

## Operator Registry

son-console uses `.son/operators` as a lightweight anchor registry. It is created empty on install: registering an operator is a deliberate, reviewed act, never automatic. To register an operator:

```bash
echo "operator@example.com" >> .son/operators
```

For stronger anchoring, sign every commit with a GPG or SSH key. The gate accepts signing only when it is switched on, because a configured key that never signs proves nothing:

```bash
git config user.signingkey <key>
git config commit.gpgsign true
git config gpg.format ssh           # for an SSH key
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
| **Kernel** | son-console (this repo) | Proves the physics, self-guards via Git |
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


**LUX Runtime** commercial deployment requires a separate license from Design Ledger PTY LTD.

**Anti-weaponization:** This protocol must not be used for surveillance, coercion, social credit systems, weapons, or any system that extracts coherence from operators. See LICENSE for full terms. Violations are irrevocable.

---

**DOI:** 10.5281/zenodo.21950371
**Corpus:** CTP/IP canonical corpus (sealed)
**Author:** Érico Lisbôa, the Architect
**Standards:** The Time Foundation (time.foundation)
**Runtime:** Design Ledger PTY LTD (designledger.co) | ABN 50 669 856 339
