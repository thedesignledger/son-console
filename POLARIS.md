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

2020-2026 | CTP/IP: Causal Time Protocol / Intentional Processing
Intellectual property of The Time Foundation. Patent enforced.
Licensed through Design Ledger Pty Ltd (ABN 50 669 856 339).
Sole author: Erico Lisboa [E.L].
Free for personal study and research. Commercial use requires prior
authorisation under the applicable system patents and copyright.
T = ΔΣ₀Γ (DSZG). Genesis: Solana mainnet zero_boundary_program
YvxS7U37b5369xzNXt1EEuXjEkp65Ngcq9NsGUr3bmZ
```

# POLARIS . son-console

Read this before touching anything in this repository. It is the boot file of the repository, the role a CLAUDE.md or AGENTS.md plays elsewhere, named POLARIS.md under the Architect's ruling of 4 September 2026 that all naming goes to Polaris. It says what the repository is and points at the law; it restates no rule.

## Authority chain

1. `Production/polaris/RULINGS.md`, then `Production/polaris/AGENT_CONTRACT.md`. Binding. The ubiquitous set, the organs, the harness and the vocabulary are declared there once and restated nowhere, this file included. `Production/polaris/AUTHORING_RULES.md` governs authorship: sole author, no stamp, no attribution, on any surface.
2. The corpus of record: `Production/0_core-corpus/CTPIP_CORPUS_D1.md`, Corpus D1, DOI 10.5281/zenodo.21950371. Its pin is never typed: `python3 0_core-corpus/build/pin.py` prints it, `python3 0_core-corpus/build/verify.py corpus` checks it. Where anything in this repository disagrees with the corpus, the corpus wins.
3. This file.
4. The repository's own documents, named below.

## What this repository is

The engineering kernel of CTP/IP as a standalone repository: `engine.mjs`, one hashed file holding the physics (Γ, ctu, thresholds, evaluation), TKDF-256, the seal derivation, the Genesis Seal and CausalAnchor, and the Guardian Gate predicate; `lib/` re-exporting it; the Five Guardian Gates as four Git hooks; the Appendix M fixtures and the falsification tests. This is release 10.0.0. The engine inscribed on chain is commit `206545a` of this repository, engine.mjs sha256 `040e14ea0a11ec3565f7994e6b5ae7054b67194438c0cc5fa551d38fc98880f1` (FC-1, Solana mainnet slot 419,487,383); `Production/sdks/son-console` holds that engine byte for byte and every importer on the estate vendors it. This release computes the same Γ, class, verdict and ctu on all twenty fixtures, and says so in its own test.

## Stack

Node 18 or later, ES modules, no dependency. `npm install` installs the hooks through the prepare script; `./install-hooks.sh <repo>` installs them anywhere.

## Build and verify

    npm test                       twenty Appendix M fixtures at 1e-9, section M.3.1 bounds, nine TKDF-256 vectors, the seal derivation, the CausalAnchor, the Genesis calibration state, the Git gates end to end
    sha256sum engine.mjs           the hash of all protocol logic in this release
    node bin/eva.mjs 0.9 0.95 0.92 0    the engine bridge: observables in, verdict out, nothing enforced

The hooks run in ADVISORY mode by default: they measure and report, the work proceeds. `git config ctpip.gates enforce` blocks on a failed gate. The E, V and A the Git adapter computes from a diff, a message and the evidence facts are the DC0 mapping specified in `Production/sdks/adapters/git/ADAPTER.md`.

## Vocabulary of this repository

The commit message is the IntentSig: `[INTENT]`, `[SCOPE]`, `[CRITERIA]`. The merge message is the Causal Handshake: `[SYN]`, `[DATA]`, `[SEAL]`, `[FIN]`. The terms retired by the corpus (TIME Protocol, Emergent Time Protocol, BTM, Coherence Scalar, KALI Runtime, AION Runtime, Fractal Ledger, ZK-PoT) are refused in code and copy; the protocol vocabulary itself is declared in RULINGS.md and not restated here.

## Do not touch

- `engine.mjs`: any change is a new engine with a new hash, released as a new version and never presented as the inscribed one.
- `test/fixtures/`: the Appendix M fixtures, bytes of the corpus.
- `.son/operators`: the anchor registry, edited by a deliberate act, never by a script.
- No timestamp, expiry or elapsed time bound anywhere; the temporal ordering check refuses future timestamps and nothing more.
