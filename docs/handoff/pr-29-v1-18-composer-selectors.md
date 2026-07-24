---
pr_number: 29
branch: fix/ui/v1-18-composer-selectors
issue: 28
title: support OpenCode 1.18.x composer selectors
status: open
created: 2026-07-24
---

# Handoff — PR #29: v1.18.x composer selectors

## Контекст

Userscript opencode-voice-dictation не вставляет кнопку микрофона в OpenCode web v1.18.x — `findComposer()` в `src/ui.ts` возвращал `null`, потому что массив `COMPOSER_SELECTORS` содержал только устаревшие селекторы `[data-component="session-composer"]` и `[data-component="session-new-composer"]`, которые полностью удалены из исходников OpenCode v1.18.x.

В OpenCode v1.18.x контейнер композера переименован:
- `[data-component="session-prompt-dock"]` — обёртка региона композера (`packages/app/src/pages/session/composer/session-composer-region.tsx:26`)
- `[data-component="prompt-input-v2"]` — v2 form-контейнер (`packages/session-ui/src/v2/components/prompt-input/index.tsx:107`)

Уцелели в v1.18.x (НЕ трогались): `[data-component="prompt-input"]` (contenteditable), `[data-action="prompt-submit"]` (кнопка отправки), `[data-slot="question-custom-input"]` (textarea).

Issue: #28.

## Что сделано

- Обновлён массив `COMPOSER_SELECTORS` в `src/ui.ts`: добавлены новые селекторы `[data-component="prompt-input-v2"]` и `[data-component="session-prompt-dock"]` как primary для OpenCode v1.18.x (первые в массиве).
- Старые селекторы `session-new-composer` / `session-composer` сохранены как fallback для обратной совместимости с OpenCode <1.18.
- `README.md` обновлён с указанием совместимой версии OpenCode v1.18.x (русский и английский блоки).
- Добавлен ADR 0001 с обоснованием порядка fallback-селекторов.

## Почему

В OpenCode v1.18.x селекторы `session-composer` / `session-new-composer` полностью удалены из исходников, из-за чего `findComposer()` возвращал `null` и кнопка 🎤 не появлялась в чате. Порядок массива обновлён как primary (v1.18.x) → fallback (pre-1.18), чтобы сохранить совместимость с OpenCode <1.18 до `oldInterfaceSunset` (2026-09-14). Функция `findComposer()` уже перебирает массив сверху вниз — изменений в логике не потребовалось.

## Pending

- После `oldInterfaceSunset` (2026-09-14) legacy-селекторы `session-new-composer` / `session-composer` станут мёртвым кодом — удалить отдельным PR.
- Отслеживать дальнейшие переименования контейнера композера в OpenCode (источник: `sst/opencode` main).

## Watch out

- Порядок `COMPOSER_SELECTORS` = приоритет детекции; не менять без обновления ADR 0001.
- `prompt-input-v2` появляется раньше `session-prompt-dock` в lifecycle (form-контейнер монтируется внутри dock'а) — порядок primary→fallback важен для раннего появления кнопки.
- Home-страница нового layout (`NewHome`) не содержит композера — userscript активен только на `/new-session` или открытых сессиях.
- `src/insert.ts` не затронут: gate `[data-component="prompt-input"]` остаётся валидным в обеих версиях UI.

## Изменения

### `src/ui.ts`
- Обновлён массив `COMPOSER_SELECTORS` (новые селекторы v1.18.x первыми как primary, старые сохранены как fallback):
  ```js
  const COMPOSER_SELECTORS = [
    '[data-component="prompt-input-v2"]',
    '[data-component="session-prompt-dock"]',
    '[data-component="session-new-composer"]',
    '[data-component="session-composer"]',
  ];
  ```
- Функция `findComposer()` уже перебирает массив — изменений не потребовалось.

### `README.md`
- Строка 13 (русский блок): предупреждение о "New UI" уточнено до совместимой версии OpenCode v1.18.x.
- Строка 68 (english-блок): аналогичное уточнение для английского блока.

### Файлы вне спеки
- `src/insert.ts`, `src/audio.ts`, `src/transcribe.ts`, `src/config.ts`, `src/keyboard.ts`, `src/types.ts`, `src/index.ts` — без изменений.

## Проверки

| Проверка | Команда | Результат |
|----------|---------|----------|
| Lint | `npm run lint` (biome check) | ✅ Checked 21 files, no fixes |
| Typecheck | `npm run typecheck` (tsc --noEmit) | ✅ No errors |
| Tests | `npm run test` (vitest run) | ✅ 47/47 passed (5 files) |
| Knip | `npm run knip` | ✅ No unused exports |

## Acceptance criteria

- [x] Кнопка 🎤 появляется в OpenCode web v1.18.x (через новые primary-селекторы `prompt-input-v2` / `session-prompt-dock`)
- [x] Старые версии OpenCode остаются совместимы (fallback-селекторы `session-new-composer` / `session-composer` сохранены)
- [x] `npm run lint && npm run typecheck && npm run test && npm run knip` проходят
- [x] README обновлён с указанием совместимой версии OpenCode v1.18.x (русский и английский блоки)

## Коммиты

1. `fix(ui): add v1.18.x composer selectors` — обновление `COMPOSER_SELECTORS` в `src/ui.ts`
2. `docs(readme): specify OpenCode v1.18.x compatibility` — уточнение совместимости в обоих языковых блоках README
3. `docs(handoff): add handoff + ADR for PR` — handoff-документ и ADR
4. `docs(handoff): set PR number` — подстановка реального номера PR (после `gh pr create`)

## ADR

См. `docs/handoff/adr/0001-pr-29-v1-18-composer-selectors-fallback-order.md`.

## Источники

- Память: `technical/opencode-web-ui-composer-selectors-1.18.4.md` (исследование `sst/opencode` main commit 2b2aacc, web pkg 1.18.4)
- Память: `repos/opencode-voice-dictation.md` (архитектура репо)