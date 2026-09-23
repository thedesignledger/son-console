# Falsification Criteria

Any single test failure falsifies the implementation, not the protocol. REJECTED is the ENFORCE mode outcome; ADVISORY mode reports the same verdict and lets the operation proceed. `npm test` runs every engine row below.

| # | Test | Expected | Hook |
|---|------|----------|------|
| 1 | Γ < 0.70 | REJECTED | pre-commit |
| 2 | Empty commit message | REJECTED | commit-msg |
| 3 | Empty commit (no diff) | REJECTED | pre-push |
| 4 | Future timestamp | REJECTED | pre-push |
| 5 | E = 0 → Γ = 0 | REJECTED | pre-commit |
| 6 | w_AI > 0 in authorship | REJECTED | GitHub Actions |
| 7 | Failed transformation → debt recorded | φ × (Γ_min - Γ) × E | pre-commit |
| 8 | E, V or A outside [0, 1], or τ < 0 (Appendix M §M.3.1) | refused, never clamped | engine |
| 9 | Any of the twenty Appendix M fixtures off by more than 1e-9 | divergence | engine |
| 10 | Any TKDF-256 conformance vector of Appendix W §W.7.10 not reproduced | divergence | engine |
| 11 | A CausalAnchor with any field changed, or a foreign key | invalid | engine |
| 12 | A Genesis calibration result read as sealable | impossible by construction | engine |
