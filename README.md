# OpenCode Voice Dictation / Голосовая диктовка для OpenCode

[![CI](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml/badge.svg)](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Voice dictation for [OpenCode](https://opencode.ai) web interface using OpenAI Whisper via Groq API. Works on both desktop and mobile browsers through a Tampermonkey/Violentmonkey userscript.

Голосовая диктовка для веб-интерфейса [OpenCode](https://opencode.ai) с использованием OpenAI Whisper через Groq API. Работает как на десктопных, так и на мобильных браузерах через юзерскрипт Tampermonkey/Violentmonkey.

---

## English

### Features

- **Whisper large-v3** transcription via Groq API (same quality as Cursor)
- **Tap-to-toggle** recording (tap to start, tap to stop)
- **Noise suppression** + echo cancellation (great for outdoor use)
- **Recording timer** (MM:SS display)
- **Ctrl+Space** keyboard shortcut on desktop
- **Custom Whisper prompt** for software development context
- **Auto-detect language** (Russian + English technical terms)
- **Auto-submit** option (configurable)
- **No backend needed** — API calls go directly from browser via `GM_xmlhttpRequest`

### Requirements

| Component | Requirement |
|-----------|-------------|
| OpenCode | Web interface running (`opencode web`) |
| Groq API key | Free at [console.groq.com/keys](https://console.groq.com/keys) |
| PC Browser | Vivaldi / Chrome / Firefox + Violentmonkey or Tampermonkey |
| Mobile Browser | Firefox for Android + Tampermonkey |

### Compatibility

| Platform | Browser | Userscript Manager | Status |
|----------|---------|-------------------|--------|
| Desktop (Linux/macOS/Windows) | Vivaldi | Violentmonkey | ✅ Supported |
| Desktop | Chrome | Tampermonkey | ✅ Supported |
| Desktop | Firefox | Tampermonkey | ✅ Supported |
| Android | Firefox | Tampermonkey | ✅ Supported |
| Android | Vivaldi | — | ❌ No extension support |
| Android | Chrome | — | ❌ No extension support |

### Install

> **One-click install**: Open this link in your browser with Violentmonkey/Tampermonkey installed:
> 
> **[Install Script](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)**
> 
> Your userscript manager will intercept the download and show an installation dialog.

#### Desktop (Vivaldi + Violentmonkey)

1. Install [Violentmonkey](https://violentmonkey.github.io/) extension in Vivaldi
2. Click the [Install Script](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js) link
3. Confirm installation in the Violentmonkey dialog

#### Android (Firefox + Tampermonkey)

1. Install [Firefox for Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox) from Play Store
2. Install [Tampermonkey](https://addons.mozilla.org/en-US/android/addon/tampermonkey/) from Firefox Add-ons
3. In Firefox, open the [Install Script](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js) link
4. Confirm installation in the Tampermonkey dialog

#### Manual install (from GitHub Releases)

1. Go to [Releases](https://github.com/slaid098/opencode-voice-dictation/releases)
2. Download `opencode-voice-dictation.user.js` from the latest release
3. Open Violentmonkey/Tampermonkey dashboard → **+** → paste the file contents → Save

### Setup

1. Get a free Groq API key at [console.groq.com/keys](https://console.groq.com/keys)
2. Open any OpenCode web page
3. Open Violentmonkey/Tampermonkey menu → **"Set Groq API Key"**
4. Paste your key (`gsk_...`)

### Auto-Update

The script updates automatically. No action needed.

- `@updateURL` checks for new versions periodically (every 24h in Tampermonkey, every 7 days in Violentmonkey)
- Only a tiny `.meta.js` (~1KB) is downloaded to check the version
- If a new version is found, the full `.user.js` (~18KB) is downloaded and installed
- Updates are published automatically by CI when code is pushed to `main`

### Usage

1. Open OpenCode web in your browser
2. A **microphone button** appears next to the chat input
3. **Tap** the button to start recording (red pulse + timer)
4. **Tap** again to stop — audio is transcribed and inserted into the input
5. (Desktop) Press **Ctrl+Space** as an alternative to clicking

### Configuration

All settings available via the Violentmonkey/Tampermonkey menu:

| Menu Item | Description |
|-----------|-------------|
| Set Groq API Key | Enter your `gsk_...` key |
| Toggle Auto-Submit | Auto-send message after transcription |
| Set Whisper Model | `whisper-large-v3` (default) or `whisper-large-v3-turbo` (faster) |
| Set Language | Language code (e.g., `ru`, `en`) or empty for auto-detect |
| Set Whisper Prompt | Context prompt for transcription accuracy |

---

## Русский

### Возможности

- **Whisper large-v3** транскрипция через Groq API (качество как в Cursor)
- **Tap-to-toggle** запись (тапнул — начал, тапнул — стоп)
- **Шумоподавление** + эхоподавление (для записи на улице)
- **Таймер записи** (формат MM:SS)
- **Ctrl+Space** горячая клавиша на ПК
- **Кастомный Whisper prompt** для контекста разработки
- **Авто-определение языка** (русский + английские технические термины)
- **Авто-отправка** опционально (настраивается)
- **Без бэкенда** — запросы идут напрямую из браузера через `GM_xmlhttpRequest`

### Требования

| Компонент | Требование |
|-----------|------------|
| OpenCode | Запущенный веб-интерфейс (`opencode web`) |
| Groq API ключ | Бесплатно на [console.groq.com/keys](https://console.groq.com/keys) |
| Браузер ПК | Vivaldi / Chrome / Firefox + Violentmonkey или Tampermonkey |
| Браузер телефон | Firefox для Android + Tampermonkey |

### Совместимость

| Платформа | Браузер | Менеджер скриптов | Статус |
|-----------|---------|-------------------|--------|
| Десктоп (Linux/macOS/Windows) | Vivaldi | Violentmonkey | ✅ Поддерживается |
| Десктоп | Chrome | Tampermonkey | ✅ Поддерживается |
| Десктоп | Firefox | Tampermonkey | ✅ Поддерживается |
| Android | Firefox | Tampermonkey | ✅ Поддерживается |
| Android | Vivaldi | — | ❌ Нет поддержки расширений |
| Android | Chrome | — | ❌ Нет поддержки расширений |

### Установка

> **Установка в один клик**: Откройте эту ссылку в браузере с установленным Violentmonkey/Tampermonkey:
> 
> **[Установить скрипт](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)**
> 
> Менеджер скриптов перехватит загрузку и покажет диалог установки.

#### ПК (Vivaldi + Violentmonkey)

1. Установите расширение [Violentmonkey](https://violentmonkey.github.io/) в Vivaldi
2. Нажмите на ссылку [Установить скрипт](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)
3. Подтвердите установку в диалоге Violentmonkey

#### Android (Firefox + Tampermonkey)

1. Установите [Firefox для Android](https://play.google.com/store/apps/details?id=org.mozilla.firefox) из Play Store
2. Установите [Tampermonkey](https://addons.mozilla.org/ru/android/addon/tampermonkey/) из дополнений Firefox
3. В Firefox откройте ссылку [Установить скрипт](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)
4. Подтвердите установку в диалоге Tampermonkey

#### Ручная установка (из GitHub Releases)

1. Перейдите на страницу [Releases](https://github.com/slaid098/opencode-voice-dictation/releases)
2. Скачайте `opencode-voice-dictation.user.js` из последнего релиза
3. Откройте панель Violentmonkey/Tampermonkey → **+** → вставьте содержимое файла → Сохранить

### Настройка

1. Получите бесплатный ключ Groq на [console.groq.com/keys](https://console.groq.com/keys)
2. Откройте любую страницу OpenCode web
3. Откройте меню Violentmonkey/Tampermonkey → **"Set Groq API Key"**
4. Вставьте ваш ключ (`gsk_...`)

### Автообновление

Скрипт обновляется автоматически. Ничего делать не нужно.

- `@updateURL` периодически проверяет новые версии (каждые 24ч в Tampermonkey, каждые 7 дней в Violentmonkey)
- Скачивается только маленький `.meta.js` (~1KB) для проверки версии
- Если найдена новая версия — скачивается полный `.user.js` (~18KB) и устанавливается
- Обновления публикуются автоматически CI при пуше в `main`

### Использование

1. Откройте OpenCode web в браузере
2. Рядом с полем ввода появится **кнопка микрофона**
3. **Тапните** кнопку для начала записи (красная пульсация + таймер)
4. **Тапните** снова для остановки — аудио транскрибируется и вставляется в поле ввода
5. (На ПК) Нажмите **Ctrl+Space** как альтернативу клику

### Настройки

Все параметры доступны через меню Violentmonkey/Tampermonkey:

| Пункт меню | Описание |
|------------|----------|
| Set Groq API Key | Ввести ключ `gsk_...` |
| Toggle Auto-Submit | Автоматическая отправка после транскрипции |
| Set Whisper Model | `whisper-large-v3` (по умолчанию) или `whisper-large-v3-turbo` (быстрее) |
| Set Language | Код языка (например, `ru`, `en`) или пусто для авто-определения |
| Set Whisper Prompt | Контекстный промпт для точности транскрипции |

---

## Development / Разработка

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
git clone https://github.com/slaid098/opencode-voice-dictation.git
cd opencode-voice-dictation
npm install
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development mode with auto-reload |
| `npm run build` | Build to `dist/opencode-voice-dictation.user.js` |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run tests with coverage (60% threshold) |
| `npm run knip` | Find unused code |

### Project Structure

```
src/
├── index.ts        # Entry point — orchestrates all modules
├── config.ts       # GM storage, defaults, validation, menu commands
├── audio.ts        # MediaRecorder, getUserMedia, audio constraints
├── transcribe.ts   # Groq API call, FormData builder, error parsing
├── insert.ts       # Contenteditable text insertion + InputEvent dispatch
├── ui.ts           # Button injection, MutationObserver, toast notifications
├── keyboard.ts     # Ctrl+Space keyboard shortcut handler
└── types.ts        # Shared TypeScript types

tests/
├── transcribe.test.ts  # FormData format, error parsing (5 tests)
├── insert.test.ts       # Contenteditable insertion, event dispatch (5 tests)
├── config.test.ts       # Defaults, key validation, state (9 tests)
├── audio.test.ts        # Time formatting (5 tests)
└── __mocks__/$/         # Mock for GM_api functions
```

### CI/CD

- **Lint**: Biome (recommended rules, `noExplicitAny: error`)
- **Typecheck**: `tsc --noEmit`
- **Knip**: Dead code detection
- **Test**: Vitest + happy-dom, 60% coverage threshold
- **Build**: Vite → single `.user.js` file
- **Dependabot**: Weekly npm + GitHub Actions updates

## License

MIT — see [LICENSE](LICENSE)
