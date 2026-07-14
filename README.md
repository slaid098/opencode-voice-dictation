# OpenCode Voice Dictation / Голосовая диктовка для OpenCode

[![CI](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml/badge.svg)](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/ci.yml)
[![Release](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/release.yml/badge.svg)](https://github.com/slaid098/opencode-voice-dictation/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Русский

Голосовая диктовка для [OpenCode](https://opencode.ai) web через Whisper (Groq API). Работает на ПК и телефоне.

> ⚠️ **Требуется новый интерфейс OpenCode.** В настройках OpenCode web включите «New UI» — в старом интерфейсе скрипт не работает.

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

1. Нажми кнопку микрофона 🎤 в правом верхнем углу поля ввода
2. Говори — виден таймер записи и кнопка отмены
3. Нажми ⏹ — запись остановится, текст вставится в поле ввода
4. Или нажми ✕ — запись отменится, текст не вставляется
5. На ПК: **Ctrl+Space** — горячая клавиша

Микрофон также доступен в поле ответа на вопросы OpenCode (когда выбираешь "ввести свой ответ").

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

Voice dictation for [OpenCode](https://opencode.ai) web via Whisper (Groq API). Works on desktop and mobile.

> ⚠️ **Requires the new OpenCode UI.** In OpenCode web settings, enable "New UI" — the script does not work in the old interface.

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

1. Click the mic button 🎤 in the top-right corner of the input area
2. Speak — recording timer and cancel button are displayed
3. Click ⏹ — recording stops, transcribed text is inserted into the input
4. Or click ✕ — recording is cancelled, no text inserted
5. Desktop: **Ctrl+Space** shortcut

The mic button is also available in OpenCode question prompt answer fields (when choosing "type your own answer").

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
