---
module: .
purpose: Index of project structure and top-level modules
last_updated: 2026-07-24
---

# Project Map — opencode-voice-dictation

Userscript для голосовой диктовки в OpenCode web через Whisper (Groq API). Точки входа в UI OpenCode определяются через массив `COMPOSER_SELECTORS` в `src/ui.ts` (primary для v1.18.x + fallback для pre-1.18).

## Top-level modules

- [`src/`](./src.md) — исходники userscript (entry, ui, audio, transcribe, insert, config, keyboard, types)
- [`tests/`](./tests.md) — unit-тесты (vitest) + моки
- [`.github/`](./github.md) — CI workflows, dependabot, release
- [`docs/`](./docs.md) — handoff, ADR, project map

## Build / tooling

- `vite.config.ts` + `vite-plugin-monkey` — сборка userscript (.user.js)
- `biome.json` — lint/format
- `tsconfig.json` — TypeScript
- `knip.json` — детектор неиспользуемого кода
- `vitest.config.ts` — test runner

## Conventions

- Один handoff на PR: `docs/handoff/pr-<N>-<slug>.md` с секциями `## Что сделано`, `## Почему`, `## Pending`, `## Watch out`.
- ADR на архитектурное решение: `docs/handoff/adr/<NNNN>-<slug>.md` с секциями `## Статус`, `## Контекст`, `## Решение`, `## Альтернативы`.
- Селекторы OpenCode UI — primary (новые) → fallback (старые), порядок = приоритет детекции.