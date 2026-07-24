---
module: .github
purpose: CI workflows, dependabot, release
key_files:
  - .github/workflows/ci.yml — CI (lint, typecheck, test, knip)
  - .github/workflows/release.yml — релиз + GitHub Release
  - .github/dependabot.yml — авто-обновление зависимостей
dependencies: []
last_updated: 2026-07-24
---

# .github/

## Structure
- `workflows/ci.yml` — CI (lint, typecheck, test, knip)
- `workflows/release.yml` — релиз + GitHub Release
- `dependabot.yml` — авто-обновление зависимостей