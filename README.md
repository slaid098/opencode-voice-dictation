# OpenCode Voice Dictation / Голосовая диктовка для OpenCode

[![CI](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml/badge.svg)](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml)
[![Release](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/release.yml/badge.svg)](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Русский

Голосовая диктовка для [OpenCode](https://opencode.ai) web через Whisper (Groq API). Качество как в Cursor. Работает на ПК и телефоне.

### Установка

> **[Установить скрипт](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)** — открой ссылку в браузере с Violentmonkey/Tampermonkey и подтверди установку.

Или скачай с [Releases](https://github.com/slaid098/opencode-voice-dictation/releases) и импортируй вручную.

### Совместимость

| Платформа | Браузер | Менеджер скриптов | Статус |
|-----------|---------|-------------------|--------|
| ПК | Vivaldi | Violentmonkey | ✅ |
| ПК | Chrome | Tampermonkey | ✅ |
| ПК | Firefox | Tampermonkey | ✅ |
| Android | Firefox | Tampermonkey | ✅ |
| Android | Vivaldi | — | ❌ Нет расширений |
| Android | Chrome | — | ❌ Нет расширений |

### Настройка

1. Получи бесплатный ключ на [console.groq.com/keys](https://console.groq.com/keys)
2. Открой OpenCode web
3. Меню Violentmonkey/Tampermonkey → **Set Groq API Key** → вставь `gsk_...`

### Использование

1. Нажми кнопку микрофона в правом верхнем углу поля ввода
2. Говори (виден таймер записи)
3. Нажми снова — текст появится в поле ввода
4. На ПК: **Ctrl+Space** — горячая клавиша

### Автообновление

Скрипт обновляется сам. При пуше в `main` CI собирает новую версию и публикует в ветку `dist`. Пользователи получают обновление автоматически.

### Настройки

| Пункт меню | Описание |
|------------|----------|
| Set Groq API Key | Ключ `gsk_...` |
| Toggle Auto-Submit | Отправлять после транскрипции |
| Set Whisper Model | `whisper-large-v3` или `whisper-large-v3-turbo` |
| Set Language | `ru`, `en` или пусто (авто) |
| Set Whisper Prompt | Контекст для точности |

---

## English

Voice dictation for [OpenCode](https://opencode.ai) web via Whisper (Groq API). Cursor-quality transcription. Works on desktop and mobile.

### Install

> **[Install Script](https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js)** — open this link in a browser with Violentmonkey/Tampermonkey and confirm installation.

Or download from [Releases](https://github.com/slaid098/opencode-voice-dictation/releases) and import manually.

### Compatibility

| Platform | Browser | Userscript Manager | Status |
|----------|---------|-------------------|--------|
| Desktop | Vivaldi | Violentmonkey | ✅ |
| Desktop | Chrome | Tampermonkey | ✅ |
| Desktop | Firefox | Tampermonkey | ✅ |
| Android | Firefox | Tampermonkey | ✅ |
| Android | Vivaldi | — | ❌ No extensions |
| Android | Chrome | — | ❌ No extensions |

### Setup

1. Get a free API key at [console.groq.com/keys](https://console.groq.com/keys)
2. Open OpenCode web
3. Violentmonkey/Tampermonkey menu → **Set Groq API Key** → paste `gsk_...`

### Usage

1. Click the mic button in the top-right corner of the input area
2. Speak (recording timer is displayed)
3. Click again — transcribed text appears in the input
4. Desktop: **Ctrl+Space** shortcut

### Auto-Update

The script updates automatically. When code is pushed to `main`, CI builds and publishes to the `dist` branch. Users receive updates automatically.

### Settings

| Menu Item | Description |
|-----------|-------------|
| Set Groq API Key | API key `gsk_...` |
| Toggle Auto-Submit | Auto-send after transcription |
| Set Whisper Model | `whisper-large-v3` or `whisper-large-v3-turbo` |
| Set Language | `ru`, `en`, or empty (auto-detect) |
| Set Whisper Prompt | Context for accuracy |

---

## License

MIT — see [LICENSE](LICENSE)
