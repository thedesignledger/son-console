# son-console

**Self-guarding engineering kernel for the Causal Time Protocol.**

son-console wires the Five Guardian Gates directly into Git's lifecycle. Every commit, push, merge, and rebase is protocol-enforced. Low-coherence transformations are rejected before they enter the repository.

The repo doesn't just implement the protocol. It *is* the protocol.

---

## What This Is — and What It Isn't

**son-console is the open-source kernel.** It contains the canonical physics (Γ computation, CTU generation, thresholds, EVA evaluation), the Five Guardian Gates, and Git hook enforcement. Anyone can clone it, inspect the equations, verify the protocol, and use it to self-guard their own repos. The falsification tests are published. The protocol is verifiable.

**LUX Runtime is the commercial product.** LUX is the full orchestration engine — the production seal pipeline, operator profiles, Fractal Fabric DAG, ZK-TSL certificates, ΔGENCY certification, Stripe CVF, telemetry channels, and sector deployment infrastructure. LUX is built on the physics defined here but is licensed separately through Design Ledger PTY LTD.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  son-console (open · CC BY-NC 4.0)                  │
│  ├── physics.mjs        Canonical Γ, CTU, EVA       │
│  ├── guardian-gates.mjs  Five Guardian Gates         │
│  ├── crypto.mjs         SHA-256 hashing             │
│  ├── genesis-gate.mjs   Genesis Seal, CausalAnchor  │
│  ├── lux-runtime.mjs    Client-side LUX surface     │
│  ├── 4 git hooks         Self-guarding enforcement  │
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
│  ├── Stripe CVF (13.5% platform fee)                │
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

Every commit, push, and merge is now Guardian Gate checked. No extra config. No dependencies.

---

## How It Works

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

From `lib/physics.mjs` — the constants that both son-console and LUX Runtime build on.

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

| Gate | Hook | What It Checks | On Failure |
|------|------|----------------|------------|
| Coherence | pre-commit | Γ ≥ 0.70 from real diff/intent/evidence | Blocked + temporal debt |
| Intent | commit-msg | IntentSig structure + anti-circularity | Blocked |
| Entropy | pre-push | ΔS > 0 across all commits in push | Blocked |
| Evidence | pre-commit | SHA-256 hash of staged diff (64-char) | Blocked |
| Anchors | pre-commit | GPG/SSH key or .son/operators registry | Blocked (warning if unsigned) |

Plus:
- **Temporal ordering** (pre-push) — no future timestamps
- **Anti-circularity** (commit-msg + pre-push) — no self-referencing or forward hash references
- **DAG Γ re-validation** (pre-push) — re-computes Γ for every commit in push range
- **Causal Handshake** (pre-merge-commit) — SYN/DATA/SEAL/FIN on merge
- **Merge Γ check** (pre-merge-commit) — blocks low-coherence merge parents

---

## Repository Structure

```
son-console/
├── lib/
│   ├── physics.mjs           ← Canonical Γ, CTU, thresholds, EVA
│   ├── guardian-gates.mjs     ← Five Guardian Gates evaluation
│   ├── lux-runtime.mjs        ← LUX client-side validation surface
│   ├── crypto.mjs             ← SHA-256 hashing (IntentSig, evidence, seals)
│   └── genesis-gate.mjs       ← Genesis Seal, CausalAnchor binding
├── hooks/
│   ├── pre-commit             ← Coherence + Evidence + Anchors
│   ├── commit-msg             ← Intent + Anti-Circularity
│   ├── pre-push               ← Entropy + Temporal + DAG Γ re-validation
│   └── pre-merge-commit       ← Causal Handshake + Merge Γ check
├── bin/
│   ├── gamma-check.mjs        ← Guardian Gate engine (all modes)
│   └── setup-hooks.mjs        ← Auto-install on npm install
├── .github/workflows/
│   └── coherence-check.yml    ← LUX Runtime on PRs
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

son-console uses `.son/operators` as a lightweight anchor registry. On install, your Git email is automatically added. To register additional operators:

```bash
echo "operator@example.com" >> .son/operators
```

For stronger anchoring, configure GPG or SSH commit signing:

```bash
git config --global commit.gpgsign true
```

---

## Production Architecture

| Layer | System | What It Does |
|-------|--------|-------------|
| **Law** | V9 Unified Corpus (DOI: 10.5281/zenodo.18742628) | Defines the protocol — Books I-VII, 279 pages |
| **Kernel** | son-console (this repo) | Proves the physics, self-guards via Git |
| **Engine** | LUX Runtime (licensed) | Production seal pipeline, operator management, Fractal Fabric |
| **Standards** | time.foundation | Education, certification (SEED→BLOOM→ROOT→Sovereign→Agency), research |
| **Runtime** | designledger.co | Commercial operator platform, ΔGENCY certification, sector deployments |
| **Proof** | sovereign-mesh-proof | Working dashboard, CausalGraph, coherence-gated messaging |

**To inspect the physics:** clone this repo.
**To operate as an institution:** license LUX through designledger.co.
**To certify as an operator:** apply through time.foundation.

---

## License

**son-console** is licensed under CC BY-NC 4.0 — non-commercial use with attribution.


**LUX Runtime** commercial deployment requires a separate license from Design Ledger PTY LTD.

**Anti-weaponization:** This protocol must not be used for surveillance, coercion, social credit systems, weapons, or any system that extracts coherence from operators. See LICENSE for full terms. Violations are irrevocable.

---

**DOI:** 10.5281/zenodo.18742628
**Corpus:** The Book of Causal Time v9.0.0
**Author:** Érico Lisbôa — The Architect, Sovereign ΔGENCY ΔEON
**Standards:** The Time Foundation (time.foundation)
**Runtime:** Design Ledger PTY LTD (designledger.co) | ABN 50 669 856 339
