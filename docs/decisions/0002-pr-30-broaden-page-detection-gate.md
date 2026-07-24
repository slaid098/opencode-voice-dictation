# ADR 0002: Broaden page detection gate + debug logging + version bump for v1.18.x

- **Date**: 2026-07-24
- **PR**: #30
- **Parent PR**: #29
- **Issue**: #28

## Статус

Accepted.

## Контекст

PR #29 исправил селекторы композера (`prompt-input-v2`, `session-prompt-dock`) для OpenCode web v1.18.x — live-браузер на opencode.slaid098.dev v1.18.3 подтвердил их корректность. Однако три пробела оставались:

1. **Gate `isOpencodePage()` проверял один селектор.** В `src/insert.ts` функция возвращала `document.querySelector('[data-component="prompt-input"]') !== null`. На v1.18.x `prompt-input` монтируется **lazy** — появляется асинхронно после загрузки сообщений сессии, внутри `session-prompt-dock`. В момент userscript `run-at: document-idle` ни `prompt-input`, ни `prompt-input-v2`, ни `session-prompt-dock` ещё не в DOM. `isOpencodePage()` возвращал `false`, `init()` уходил в `setTimeout(init, 1500)` и крутился в retry, задерживая инициализацию UI на 1.5s+ (а при медленной сети — дольше). Пользователь не видел, что скрипт вообще пытается.

2. **Нет отладочного логирования.** Все точки отказа были тихими: `isOpencodePage() === false`, `findComposer() === null`, успешный inject кнопки 🎤 — ни одно не писало в DevTools Console. Диагностика «скрипт не работает у пользователя» превращалась в гадание: загрузился ли userscript вообще? дошёл ли до gate? прошёл gate? нашёл композер? внедрил кнопку? Без логирования поддержке не за что зацепиться.

3. **`@version` осталась `1.0.0` после PR #29.** PR #29 менял код селекторов, но не бампал версию. Userscript-менеджеры (Violentmonkey, Tampermonkey) сравнивают `@version` из `.meta.js` (генерируется из `vite.config.ts` `userscript.version` через vite-plugin-monkey) — равные версии = нет автообновления. Пользователи оставались на сломанном билде PR #28, хотя исправление уже в репо.

Дополнительные ограничения:
- `oldInterfaceSunset = 2026-09-14` (`packages/app/src/context/settings.tsx:62`) — legacy UI окончательно уходит; селекторы `session-composer` / `session-new-composer` в gate будут мёртвым кодом после этой даты (общая pending-задача с ADR 0001).
- `run-at: document-idle` в `vite.config.ts` — userscript запускается после парсинга DOM, но до полного hydration SPA OpenCode. Lazy-mount композера — норма для SPA, не баг OpenCode.
- `match: ["*://*/*"]` — скрипт грузится на всех сайтах; gate должен отсеивать не-OpenCode страницы без побочных эффектов.

## Решение

**1. Расширить gate до 6 селекторов (любой = страница OpenCode с композером).** Добавить массив `PAGE_DETECT_SELECTORS` в `src/insert.ts`, `isOpencodePage()` проверяет через `Array.some()`:

```ts
const PAGE_DETECT_SELECTORS = [
  '[data-component="prompt-input"]',
  '[data-component="prompt-input-v2"]',
  '[data-component="session-prompt-dock"]',
  '[data-component="session-composer"]',
  '[data-component="session-new-composer"]',
  '[data-slot="question-custom-input"]',
];

export function isOpencodePage(): boolean {
  return PAGE_DETECT_SELECTORS.some((s) => document.querySelector(s) !== null);
}
```

Множественные селекторы ловят любой ранний маркер страницы OpenCode — `session-prompt-dock` монтируется раньше `prompt-input` в lifecycle v1.18.x, что сокращает задержку инициализации. `session-composer` / `session-new-composer` сохранены как fallback для pre-1.18 (до `oldInterfaceSunset`).

**2. Добавить `console.log` с префиксом `[ocvd]`** в ключевых точках lifecycle:
- `src/index.ts init()`: `[ocvd] OpenCode page not detected, retrying in 1.5s...` (retry) и `[ocvd] OpenCode page detected, setting up UI` (успех)
- `src/ui.ts findComposer()`: `[ocvd] Composer found via ${selector}` (какой селектор сработал) и `[ocvd] No composer found in DOM` (провал)
- `src/ui.ts injectIntoComposer()`: `[ocvd] Mic button injected into composer` (успех inject)

Единый префикс `[ocvd]` = grep-маркер в DevTools Console. Пять точек покрывают весь путь: gate retry → gate success → composer search → composer found/miss → button inject.

**3. Бамп `@version` до `1.0.1` в обоих source-of-truth:**
- `package.json` `"version": "1.0.1"` (npm/semver)
- `vite.config.ts` `userscript.version: "1.0.1"` (vite-plugin-monkey → `.meta.js` → userscript-менеджеры)

Синхронный бамп обоих файлов обязателен: vite-plugin-monkey берёт `@version` только из `vite.config.ts`, `package.json` на userscript-менеджеры не влияет.

## Альтернативы

### 1. Ждать lazy-mount `prompt-input` без расширения gate
- **Плюс**: минимальная правка, gate остаётся на одном селекторе.
- **Минус**: на v1.18.x `prompt-input` монтируется последним в цепочке (`session-prompt-dock` → `prompt-input-v2` → `prompt-input` contenteditable). Gate на одном `prompt-input` добавляет +1.5s+ задержки инициализации на каждый retry-цикл, на медленной сети — кратно больше. Пользователь видит пустой композер без кнопки 🎤 дольше необходимого.

### 2. MutationObserver для gate вместо polling
- **Плюс**: реактивность — `isOpencodePage()` срабатывает в момент появления любого селектора, без retry-цикла 1500ms.
- **Минус**: сложнее. Требует переделки `init()` с polling на observer, обработки disconnect, аккуратной работы с re-mount (SPA-навигация между сессиями). Текущий polling 1500ms достаточно лёгкий и понятный; переход на observer — отдельная задача с тестами. Для PR #30 (hotfix) избыточно.

### 3. Single source of truth для `@version` через `process.env.npm_package_version`
- **Плюс**: бамп только `package.json`, `vite.config.ts` читает версию через `process.env.npm_package_version` (vite подставляет автоматически). Исключает рассинхрон.
- **Минус**: требует тестов на сборку (verify, что `userscript.version` в `.meta.js` реально подставился из env), возможны edge-cases с vite-plugin-monkey (плагин может требовать строковый литерал в schema). Отложено — не blocking для PR #30, кандидат на отдельный PR с тестами.

### 4. Вынести логирование под флаг `GM_getValue("debug")`
- **Плюс**: production-билд чистый, логи только для диагностики.
- **Минус**: лишний `GM_getValue`-вызов на каждый лог, плюс пользователь не сможет включить логи без знания меню Violentmonkey. Для PR #30 (диагностика после ряда жалоб) важнее «логи видны всегда» — флаг откладывается до момента, когда логи станут шумом.

## Последствия

- Gate `isOpencodePage()` проходит на любой странице, где присутствует хотя бы один из 6 селекторов — задержка инициализации на v1.18.x сокращается (ранний маркер `session-prompt-dock` ловится раньше `prompt-input`).
- DevTools Console содержит трассу `[ocvd]` от gate до inject — диагностика «скрипт не работает» сводится к grep `[ocvd]` в Console.
- `@version` 1.0.1 в `.meta.js` разблокирует автообновление userscript-менеджеров — пользователи получают исправление PR #29 + PR #30 одним обновлением.
- Логирование `[ocvd]` остаётся в production-билде (vite-plugin-monkey не дропает `console.log`); если станет шумом — убрать или вынести под флаг.
- `PAGE_DETECT_SELECTORS` и `COMPOSER_SELECTORS` (ADR 0001) частично перекрываются, но служат разным целям: gate (`some()`, порядок не важен) vs composer-find (`for...of`, порядок = приоритет). Не объединять.
- После `oldInterfaceSunset` (14.09.2026) legacy-селекторы `session-composer` / `session-new-composer` в `PAGE_DETECT_SELECTORS` станут мёртвым кодом — удалить вместе с cleanup из ADR 0001.

## Источники

- `src/insert.ts` (текущий): `PAGE_DETECT_SELECTORS`, `isOpencodePage()`
- `src/index.ts` (текущий): `init()`, логирование gate
- `src/ui.ts` (текущий): `findComposer()`, `injectIntoComposer()`, логирование composer
- `vite.config.ts` (текущий): `userscript.version`, `run-at: document-idle`
- Предыдущий ADR: `docs/decisions/0001-pr-29-v1-18-composer-selectors-fallback-order.md` (порядок `COMPOSER_SELECTORS`, `oldInterfaceSunset`)
- Память: `technical/opencode-web-ui-composer-selectors-1.18.4.md` (lazy-mount композера на v1.18.x)