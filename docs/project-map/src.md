---
module: src
purpose: Исходники userscript — UI, аудио-захват, транскрипция, вставка текста
key_files:
  - src/index.ts — entry point userscript
  - src/ui.ts — позиционирование кнопки 🎤, COMPOSER_SELECTORS, findComposer()
  - src/audio.ts — захват микрофона (MediaRecorder)
  - src/transcribe.ts — отправка в Groq Whisper API
  - src/insert.ts — вставка транскрипта в prompt-input
  - src/config.ts — настройки (API key, hotkey, language)
  - src/keyboard.ts — глобальный hotkey
  - src/types.ts — shared типы
dependencies: []
last_updated: 2026-07-24
---

# src/

## Structure
- `index.ts` — entry point userscript
- `ui.ts` — позиционирование кнопки 🎤, `COMPOSER_SELECTORS`, `findComposer()`, MutationObserver
- `audio.ts` — захват микрофона (MediaRecorder)
- `transcribe.ts` — отправка в Groq Whisper API
- `insert.ts` — вставка транскрипта в prompt-input (gate `[data-component="prompt-input"]`)
- `config.ts` — настройки (API key, hotkey, language)
- `keyboard.ts` — глобальный hotkey
- `types.ts` — shared типы

## Patterns
- Селекторы OpenCode UI собраны в массив `COMPOSER_SELECTORS` (primary → fallback), `findComposer()` перебирает сверху вниз.
- UI-элементы появляются асинхронно — отслеживаются через MutationObserver в `setupUI`.