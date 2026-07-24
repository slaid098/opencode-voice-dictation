---
pr_number: 30
branch: fix/ui/v1-18-runtime-gate-debug
parent_pr: 29
title: broaden page gate + debug logging + version bump for v1.18.x
status: open
created: 2026-07-24
---

# Handoff — PR #30: v1.18.x runtime gate + debug logging + version bump

## Контекст

PR #29 (`fix/ui): support OpenCode 1.18.x composer selectors`) добавил корректные селекторы `prompt-input-v2` и `session-prompt-dock` в массив `COMPOSER_SELECTORS` — live-браузер на opencode.slaid098.dev v1.18.3 подтвердил их валидность. Однако PR #29 оставил три пробела, из-за которых скрипт всё ещё не запускался у реальных пользователей:

1. **`@version` не бампнута.** В `package.json` и `vite.config.ts` осталась `1.0.0` (та же, что у PR #29). Userscript-менеджеры (Violentmonkey/Tampermonkey) сравнивают `@version` из `.meta.js` для автообновления — совпадение версий = нет обновления = пользователи остаются на сломанном билде PR #28.
2. **Gate `isOpencodePage()` узкий.** В `src/insert.ts` функция проверяла только `[data-component="prompt-input"]`. На v1.18.x композер монтируется lazy (после загрузки сообщений сессии), а `prompt-input` в `PAGE_DETECT_SELECTORS` стоит первым — но в момент `document-idle` run-at ни один из 6 селекторов может ещё не быть в DOM. Скрипт уходил в retry каждые 1500ms и пользователь не понимал, запустился ли он вообще.
3. **Нет отладочного логирования.** Все точки отказа (`isOpencodePage() === false`, `findComposer() === null`, успешный inject) были тихими — в DevTools Console ничего не появлялось, диагностика «скрипт не работает» превращалась в гадание.

Issue: #28 (родительский). PR #30 — продолжение без новой issue.

## Что сделано

Три коммита на ветке `fix/ui/v1-18-runtime-gate-debug`:

- **`d5f80e7` fix(ui): broaden page detection gate for v1.18.x** — `src/insert.ts`: добавлен массив `PAGE_DETECT_SELECTORS` из 6 селекторов, `isOpencodePage()` теперь возвращает `true` при совпадении любого (через `.some()`). Расширение с 1 селектора (`prompt-input`) до 6 (`prompt-input`, `prompt-input-v2`, `session-prompt-dock`, `session-composer`, `session-new-composer`, `question-custom-input`).
- **`6982bfb` feat(ui): add debug logging for init and composer detection** — `src/index.ts` (2 строки в `init()`) + `src/ui.ts` (3 строки в `findComposer()` / `injectIntoComposer()`): `console.log` с унифицированным префиксом `[ocvd]` в каждой ключевой точке lifecycle.
- **`af3edc7` chore: bump version to 1.0.1** — `package.json` и `vite.config.ts`: `1.0.0` → `1.0.1` в обоих файлах (синхронно).

## Почему

- **`@version` не бампнута в PR #29.** Userscript-менеджеры не подтягивают изменения, если `@version` в `.meta.js` не выросла. PR #29 менял код селекторов, но не трогал версию — пользователи получали «обновление недоступно», хотя код был исправлен. PR #30 бампает версию в обоих source-of-truth (`package.json` для npm, `vite.config.ts` userscript.version для vite-plugin-monkey).
- **Gate проверял только `prompt-input`.** На v1.18.x `prompt-input` монтируется lazy внутри `session-prompt-dock` после hydration сессии. В момент `document-idle` run-at элемента ещё нет, `isOpencodePage()` возвращает `false`, `init()` уходит в `setTimeout(init, 1500)` и крутится до тех пор, пока композер не появится. С 6 селекторами `some()` ловит любой ранний маркер страницы OpenCode (`session-prompt-dock` монтируется раньше `prompt-input`).
- **Нет логирования для диагностики.** Без `console.log` пользователь не мог отличить «скрипт не загрузился» от «скрипт загрузился, но gate не прошёл» от «скрипт загрузился, gate прошёл, но композер не найден». Префикс `[ocvd]` даёт единый grep-маркер в DevTools Console.

## Pending

- После merge проверить live на opencode.slaid098.dev v1.18.3: открыть DevTools Console, обновить страницу с установленным userscript 1.0.1 — должны появиться `[ocvd] OpenCode page detected, setting up UI` → `[ocvd] Composer found via [data-component="prompt-input-v2"]` → `[ocvd] Mic button injected into composer`. Если вместо `detected` крутится `not detected, retrying in 1.5s...` — gate недостаточен, расширять `PAGE_DETECT_SELECTORS` дальше.
- Подтвердить, что userscript-менеджеры подтянули автообновление: сравнить `@version` в `about:` для установленного скрипта с `1.0.1`. Если менеджер не видит обновление — проверить, что `updateURL` в `vite.config.ts` указывает на свежий `.meta.js` в ветке `dist/` (или `main` после merge).
- После `oldInterfaceSunset` (2026-09-14) legacy-селекторы `session-composer` / `session-new-composer` в `PAGE_DETECT_SELECTORS` и `COMPOSER_SELECTORS` станут мёртвым кодом — удалить отдельным PR (общая задача с PR #29 pending).
- Логирование `[ocvd]` остаётся в production: если после стабилизации появится шум в Console пользователей — вынести под флаг `GM_getValue("debug")` или убрать полностью.

## Watch out

- **vite-plugin-monkey берёт `@version` из `vite.config.ts` `userscript.version`, НЕ из `package.json`.** `package.json.version` нужен только для npm/semver-инструментов. Рассинхрон = бамп одного файла → userscript-менеджеры не видят обновления, хотя npm видит. PR #30 бампает оба синхронно, но в будущем это ловушка — кандидат на single source of truth через `process.env.npm_package_version` (см. ADR 0002, альтернатива 3).
- **Логирование `[ocvd]` останется в production-билде.** `vite-plugin-monkey` не вырезает `console.log` по умолчанию. Все 5 точек (`index.ts:177,181`, `ui.ts:254,258,306`) попадут в `.user.js`. Не забывать убирать если будет шум, либо включать `terser` drop_console.
- **Порядок `PAGE_DETECT_SELECTORS` не имеет семантического значения** (в отличие от `COMPOSER_SELECTORS`, где порядок = приоритет): `some()` возвращает `true` по первому совпадению, gate только решает «страница OpenCode или нет». Не путать с `COMPOSER_SELECTORS` из ADR 0001, где порядок критичен.
- **`src/insert.ts` `PROMPT_INPUT_SELECTOR` (одиночный) не удалён** — он используется `insertIntoContenteditable()` для фактической вставки текста, не для gate. Не объединять с `PAGE_DETECT_SELECTORS`.
- **Retry `setTimeout(init, 1500)` не имеет backoff/лимита** — если страница никогда не станет OpenCode (false match на стороннем сайте), скрипт крутится бесконечно. На текущем `match: ["*://*/*"]` это потенциальная утечка таймера; вне scope PR #30, но отметить на будущее.

## Изменения

### `src/insert.ts`
- Добавлен массив `PAGE_DETECT_SELECTORS` (6 селекторов):
  ```ts
  const PAGE_DETECT_SELECTORS = [
    '[data-component="prompt-input"]',
    '[data-component="prompt-input-v2"]',
    '[data-component="session-prompt-dock"]',
    '[data-component="session-composer"]',
    '[data-component="session-new-composer"]',
    '[data-slot="question-custom-input"]',
  ];
  ```
- `isOpencodePage()` изменён с `document.querySelector(PROMPT_INPUT_SELECTOR) !== null` на `PAGE_DETECT_SELECTORS.some((s) => document.querySelector(s) !== null)`.
- `PROMPT_INPUT_SELECTOR`, `SUBMIT_SELECTOR`, `QUESTION_INPUT_SELECTOR` — без изменений (используются `insertIntoContenteditable` / `submitPrompt` / `isQuestionPromptOpen`).

### `src/index.ts`
- `init()`: добавлены 2 `console.log` — `[ocvd] OpenCode page not detected, retrying in 1.5s...` (ветка retry) и `[ocvd] OpenCode page detected, setting up UI` (ветка успеха).

### `src/ui.ts`
- `findComposer()`: добавлен `console.log(\`[ocvd] Composer found via ${selector}\`)` при совпадении и `[ocvd] No composer found in DOM` при провале.
- `injectIntoComposer()`: добавлен `[ocvd] Mic button injected into composer` после успешного inject.

### `package.json`
- `"version": "1.0.0"` → `"version": "1.0.1"`.

### `vite.config.ts`
- `userscript.version: "1.0.0"` → `"1.0.1"`.

### Файлы вне спеки
- `src/audio.ts`, `src/transcribe.ts`, `src/config.ts`, `src/keyboard.ts`, `src/types.ts` — без изменений.

## Коммиты

1. `d5f80e7` fix(ui): broaden page detection gate for v1.18.x — `src/insert.ts`
2. `6982bfb` feat(ui): add debug logging for init and composer detection — `src/index.ts`, `src/ui.ts`
3. `af3edc7` chore: bump version to 1.0.1 — `package.json`, `vite.config.ts`
4. `docs(handoff): add handoff + ADR for PR #30` — этот коммит

## ADR

См. `docs/decisions/0002-pr-30-broaden-page-detection-gate.md`.

## Источники

- Предыдущий handoff: `docs/handoff/pr-29-v1-18-composer-selectors.md` (родительский PR, селекторы v1.18.x)
- Предыдущий ADR: `docs/decisions/0001-pr-29-v1-18-composer-selectors-fallback-order.md` (порядок `COMPOSER_SELECTORS`)
- Память: `technical/opencode-web-ui-composer-selectors-1.18.4.md` (исследование `sst/opencode` main, lazy-mount композера)
- Live-верификация: opencode.slaid098.dev v1.18.3 (DevTools, confirm селекторов v1.18.x)