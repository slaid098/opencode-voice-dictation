# ADR 0001: COMPOSER_SELECTORS fallback order for OpenCode v1.18.x

- **Date**: 2026-07-24
- **PR**: #29
- **Issue**: #28

## Статус

Accepted.

## Контекст

OpenCode web v1.18.x переименовал контейнер композера:
- `session-composer` → `session-new-composer` → **`session-prompt-dock`** (текущий, обёртка региона)
- добавлен **`prompt-input-v2`** (v2 form-контейнер внутри `PromptInputV2Composer`)

Старые селекторы `session-composer` и `session-new-composer` **полностью удалены** из исходников OpenCode v1.18.x (0 совпадений по grep в `src/`, только упоминания в stories/comments).

Userscript opencode-voice-dictation использует `findComposer()` в `src/ui.ts` для позиционирования кнопки микрофона. Массив `COMPOSER_SELECTORS` перебирается сверху вниз, возвращается первый найденный элемент. С устаревшими селекторами `findComposer()` возвращал `null` в v1.18.x — кнопка 🎤 не появлялась.

Дополнительные ограничения:
- `oldInterfaceSunset = 2026-09-14` (`packages/app/src/context/settings.tsx:62`) — legacy UI окончательно уходит, после этой даты fallback на `session-composer` станет бесполезен.
- Home-страница нового layout (`NewHome`) не содержит композера вообще — userscript активен только на `/new-session` или открытых сессиях.
- `promptReady()` lazy-mount: prompt-input появляется асинхронно после загрузки сообщений; MutationObserver в `setupUI` корректно отслеживает.

## Решение

Обновить `COMPOSER_SELECTORS` в порядке **новое → старое** (primary → fallback):

```js
const COMPOSER_SELECTORS = [
  '[data-component="prompt-input-v2"]',        // v2 form-контейнер (v1.18.x primary)
  '[data-component="session-prompt-dock"]',     // v1.18.x регион-обёртка
  '[data-component="session-new-composer"]',   // pre-1.18 fallback
  '[data-component="session-composer"]',       // legacy fallback (<1.17)
];
```

## Альтернативы

### 1. Только новые селекторы (без fallback)
- **Плюс**: проще, нет мёртвого кода после `oldInterfaceSunset`.
- **Минус**: ломает пользователей на OpenCode <1.18 (а это основная установленная база до 14.09.2026). Нарушает acceptance criterion "старые версии остаются совместимы".

### 2. Только `session-prompt-dock` (без `prompt-input-v2`)
- **Плюс**: один селектор для региона.
- **Минус**: `prompt-input-v2` появляется раньше в lifecycle (form-контейнер монтируется внутри dock'а до того, как dock готов). Пропуск `prompt-input-v2` задерживает появление кнопки. Issue явно требует оба селектора.

### 3. Обратный порядок (fallback → primary)
- **Минус**: на v1.18.x `findComposer()` сразу вернёт `null` для `session-composer`/`session-new-composer` (они удалены), потом найдёт `session-prompt-dock` — работает, но семантически неверно и менее читаемо. Плюс на гибридных сборках может совпасть устаревший элемент первым.

## Последствия

- Кнопка 🎤 появляется в OpenCode v1.18.x (через `prompt-input-v2` или `session-prompt-dock`).
- Обратная совместимость с OpenCode <1.18 сохранена через `session-new-composer` / `session-composer`.
- После `oldInterfaceSunset` (14.09.2026) два последних селектора станут мёртвым кодом — можно удалить отдельным PR, не критично.
- Порядок массива = приоритет детекции; `findComposer()` без изменений.
- Не затрагивает `src/insert.ts` (gate `[data-component="prompt-input"]` остаётся валидным в обеих версиях UI).

## Источники

- `sst/opencode` main (commit 2b2aacc, web pkg 1.18.4):
  - `packages/app/src/pages/session/composer/session-composer-region.tsx:26` — `session-prompt-dock`
  - `packages/session-ui/src/v2/components/prompt-input/index.tsx:107` — `prompt-input-v2`
  - `packages/app/src/context/settings.tsx:62` — `oldInterfaceSunset = 2026-09-14`
- Память: `technical/opencode-web-ui-composer-selectors-1.18.4.md`