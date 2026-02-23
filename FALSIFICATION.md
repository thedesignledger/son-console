# Falsification Criteria

Any single test failure falsifies the implementation, not the protocol.

| # | Test | Expected | Hook |
|---|------|----------|------|
| 1 | Γ < 0.70 | REJECTED | pre-commit |
| 2 | Empty commit message | REJECTED | commit-msg |
| 3 | Empty commit (no diff) | REJECTED | pre-push |
| 4 | Future timestamp | REJECTED | pre-push |
| 5 | E = 0 → Γ = 0 | REJECTED | pre-commit |
| 6 | w_AI > 0 in authorship | REJECTED | GitHub Actions |
| 7 | Failed transformation → debt recorded | φ × (Γ_min − Γ) × E | pre-commit |
