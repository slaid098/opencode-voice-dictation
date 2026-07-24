---
module: tests
purpose: Unit-тесты (vitest) + моки
key_files:
  - tests/__mocks__/$/index.ts — моки
  - tests/audio.test.ts — тесты audio
  - tests/config.test.ts — тесты config
  - tests/insert.test.ts — тесты insert
  - tests/keyboard.test.ts — тесты keyboard
  - tests/transcribe.test.ts — тесты transcribe
dependencies: [src]
last_updated: 2026-07-24
---

# tests/

## Structure
- `__mocks__/$/index.ts` — моки
- `audio.test.ts` — тесты audio
- `config.test.ts` — тесты config
- `insert.test.ts` — тесты insert
- `keyboard.test.ts` — тесты keyboard
- `transcribe.test.ts` — тесты transcribe

## Patterns
- vitest run, 47 тестов (5 файлов).