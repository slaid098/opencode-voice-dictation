// ==UserScript==
// @name         OpenCode Voice Dictation
// @namespace    https://github.com/slaid098/opencode-voice-dictation
// @version      1.0.0
// @author       slaid098
// @description  Voice dictation for OpenCode web using Whisper (Groq API) - works on PC and mobile
// @icon         https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/main/assets/icon.png
// @downloadURL  https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.user.js
// @updateURL    https://raw.githubusercontent.com/slaid098/opencode-voice-dictation/dist/opencode-voice-dictation.meta.js
// @match        *://*/*
// @connect      api.groq.com
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  function createAudioRecorder() {
    let mediaRecorder = null;
    let chunks = [];
    let stream = null;
    let recording = false;
    return {
      async start() {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        chunks = [];
        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
        mediaRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: 128e3,
          mimeType
        });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        mediaRecorder.start();
        recording = true;
      },
      stop() {
        return new Promise((resolve) => {
          if (!mediaRecorder) {
            resolve(new Blob());
            return;
          }
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: "audio/webm" });
            if (stream) {
              for (const track of stream.getTracks()) {
                track.stop();
              }
            }
            recording = false;
            resolve(blob);
          };
          mediaRecorder.stop();
        });
      },
      isRecording() {
        return recording;
      }
    };
  }
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const DEFAULTS = {
    groqApiKey: "",
    model: "whisper-large-v3",
    language: "",
    whisperPrompt: "Software development discussion. Common terms: API, JSON, async, await, function, class, component, endpoint, deployment, refactoring, merge, commit, pull request, branch, repository, TypeScript, Python, Docker, Kubernetes, OpenCode, Whisper, Groq, contenteditable, SolidJS, Vite, Biome, Vitest, MutationObserver, FormData, MediaRecorder.",
    autoSubmit: false
  };
  function getConfig() {
    return {
      groqApiKey: _GM_getValue("groqApiKey", DEFAULTS.groqApiKey),
      model: _GM_getValue("model", DEFAULTS.model),
      language: _GM_getValue("language", DEFAULTS.language),
      whisperPrompt: _GM_getValue("whisperPrompt", DEFAULTS.whisperPrompt),
      autoSubmit: _GM_getValue("autoSubmit", DEFAULTS.autoSubmit)
    };
  }
  function setConfig(partial) {
    for (const [key, value] of Object.entries(partial)) {
      _GM_setValue(key, value);
    }
  }
  function validateApiKey(key) {
    return key.startsWith("gsk_") && key.length > 20;
  }
  function isFirstRun() {
    return _GM_getValue("groqApiKey", "") === "";
  }
  function registerMenuCommands(callbacks) {
    _GM_registerMenuCommand("Set Groq API Key", callbacks.onSetKey);
    _GM_registerMenuCommand("Toggle Auto-Submit", callbacks.onToggleAutoSubmit);
    _GM_registerMenuCommand("Set Whisper Model", callbacks.onSetModel);
    _GM_registerMenuCommand("Set Language", callbacks.onSetLanguage);
    _GM_registerMenuCommand("Set Whisper Prompt", callbacks.onSetPrompt);
  }
  const PROMPT_INPUT_SELECTOR = '[data-component="prompt-input"]';
  const SUBMIT_SELECTOR = '[data-action="prompt-submit"]';
  function isOpencodePage() {
    return document.querySelector(PROMPT_INPUT_SELECTOR) !== null;
  }
  function insertText(text) {
    const input = document.querySelector(PROMPT_INPUT_SELECTOR);
    if (!input) {
      return false;
    }
    input.focus();
    const selection = window.getSelection();
    if (selection) {
      selection.selectAllChildren(input);
      selection.collapseToEnd();
    }
    document.execCommand("insertText", false, text);
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
    return true;
  }
  function submitPrompt() {
    const submitButton = document.querySelector(SUBMIT_SELECTOR);
    if (!submitButton) {
      return false;
    }
    submitButton.click();
    return true;
  }
  const KEY_ALIASES = {
    space: " ",
    enter: "enter",
    tab: "tab",
    esc: "escape",
    escape: "escape"
  };
  function normalizeKey(key) {
    return KEY_ALIASES[key] ?? key;
  }
  function setupKeyboardShortcut(callback, combo = "ctrl+space") {
    const parts = combo.toLowerCase().split("+");
    const key = normalizeKey(parts[parts.length - 1]);
    const needsCtrl = parts.includes("ctrl");
    const needsShift = parts.includes("shift");
    const handler = (e) => {
      if (e.key.toLowerCase() === key && e.ctrlKey === needsCtrl && e.shiftKey === needsShift) {
        e.preventDefault();
        callback();
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }
  const GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
  function buildFormData(audioBlob, config) {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", config.model);
    formData.append("response_format", "text");
    if (config.language) {
      formData.append("language", config.language);
    }
    if (config.whisperPrompt) {
      formData.append("prompt", config.whisperPrompt);
    }
    return formData;
  }
  function parseErrorResponse(status, body) {
    var _a;
    if (status === 401) {
      return "Invalid API key. Check your Groq API key in settings.";
    }
    if (status === 429) {
      return "Rate limit exceeded. Please wait and try again.";
    }
    if (status >= 500) {
      return "Groq server error. Please try again later.";
    }
    try {
      const error = JSON.parse(body);
      return ((_a = error == null ? void 0 : error.error) == null ? void 0 : _a.message) ?? `Error ${status}`;
    } catch {
      return `Error ${status}: ${body}`;
    }
  }
  function transcribe(audioBlob, config) {
    return new Promise((resolve, reject) => {
      if (!config.groqApiKey) {
        reject(new Error("Groq API key not set. Use the Tampermonkey/Violentmonkey menu to set it."));
        return;
      }
      if (audioBlob.size === 0) {
        reject(new Error("No audio recorded. Please try again."));
        return;
      }
      const formData = buildFormData(audioBlob, config);
      _GM_xmlhttpRequest({
        method: "POST",
        url: GROQ_API_URL,
        headers: {
          Authorization: `Bearer ${config.groqApiKey}`
        },
        data: formData,
        onload: (response) => {
          if (response.status === 200) {
            resolve({ text: response.responseText.trim() });
          } else {
            reject(new Error(parseErrorResponse(response.status, response.responseText)));
          }
        },
        onerror: () => {
          reject(new Error("Network error: could not reach Groq API"));
        },
        ontimeout: () => {
          reject(new Error("Request timeout: Groq API did not respond"));
        }
      });
    });
  }
  const BUTTON_ID = "opencode-voice-dictation-btn";
  const COMPOSER_SELECTORS = [
    '[data-component="session-composer"]',
    '[data-component="session-new-composer"]'
  ];
  function createButtonStyle() {
    return `
    #${BUTTON_ID} {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid var(--color-border, #333);
      background: var(--color-bg-secondary, #1a1a1a);
      color: var(--color-text-secondary, #888);
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      font-size: 18px;
      padding: 0;
      gap: 4px;
    }
    #${BUTTON_ID}:hover {
      background: var(--color-bg-tertiary, #2a2a2a);
      color: var(--color-text-primary, #fff);
    }
    #${BUTTON_ID}.recording {
      background: #e53935;
      color: #fff;
      border-color: #e53935;
      animation: pulse 1.5s ease-in-out infinite;
    }
    #${BUTTON_ID}.processing {
      background: var(--color-accent, #4a9eff);
      color: #fff;
      border-color: var(--color-accent, #4a9eff);
      pointer-events: none;
      opacity: 0.7;
    }
    #${BUTTON_ID} .timer {
      font-size: 11px;
      font-weight: 600;
      font-family: monospace;
      margin-right: 2px;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(229, 57, 53, 0); }
    }
    #opencode-voice-toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-family: -apple-system, sans-serif;
      z-index: 999999;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      max-width: 90vw;
      text-align: center;
    }
    #opencode-voice-toast.visible {
      opacity: 1;
    }
    #opencode-voice-toast.error {
      background: #e53935;
    }
  `;
  }
  function injectStyles() {
    if (document.getElementById("opencode-voice-dictation-style")) {
      return;
    }
    const style = document.createElement("style");
    style.id = "opencode-voice-dictation-style";
    style.textContent = createButtonStyle();
    document.head.appendChild(style);
  }
  function showToast(message, isError = false) {
    let toast = document.getElementById("opencode-voice-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "opencode-voice-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = isError ? "visible error" : "visible";
    setTimeout(() => {
      toast.className = "";
    }, 4e3);
  }
  function createButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.title = "Voice Dictation (Ctrl+Space)";
    button.innerHTML = "&#127908;";
    return button;
  }
  function updateButtonState(button, state, elapsedSeconds2 = 0) {
    button.classList.remove("recording", "processing");
    switch (state) {
      case "idle":
        button.innerHTML = "&#127908;";
        button.title = "Voice Dictation (Ctrl+Space)";
        break;
      case "recording":
        button.classList.add("recording");
        button.innerHTML = `<span class="timer">${formatTimer(elapsedSeconds2)}</span>&#9209;`;
        button.title = "Stop recording";
        break;
      case "processing":
        button.classList.add("processing");
        button.innerHTML = "&#8987;";
        button.title = "Transcribing...";
        break;
    }
  }
  function formatTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  function findComposer() {
    for (const selector of COMPOSER_SELECTORS) {
      const el = document.querySelector(selector);
      if (el) {
        return el;
      }
    }
    return null;
  }
  function isButtonInjected() {
    return document.getElementById(BUTTON_ID) !== null;
  }
  function injectButton(onToggle) {
    if (isButtonInjected()) {
      return;
    }
    const composer = findComposer();
    if (!composer) {
      return;
    }
    injectStyles();
    const button = createButton();
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle();
    });
    composer.appendChild(button);
  }
  function setupUI(onToggle, getState) {
    const observer = new MutationObserver(() => {
      injectButton(onToggle);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    injectButton(onToggle);
    return {
      inject: () => injectButton(onToggle),
      updateState: (state, elapsedSeconds2 = 0) => {
        const button = document.getElementById(BUTTON_ID);
        if (button) {
          updateButtonState(button, state, elapsedSeconds2);
        }
      },
      toast: showToast
    };
  }
  let recorder = null;
  let currentState = "idle";
  let timerInterval = null;
  let elapsedSeconds = 0;
  let ui = null;
  function startTimer() {
    elapsedSeconds = 0;
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      ui == null ? void 0 : ui.updateState(currentState, elapsedSeconds);
    }, 1e3);
  }
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }
  async function toggleDictation() {
    if (currentState === "idle") {
      await startRecording();
    } else if (currentState === "recording") {
      await stopAndTranscribe();
    }
  }
  async function startRecording() {
    try {
      recorder = createAudioRecorder();
      await recorder.start();
      currentState = "recording";
      startTimer();
      ui == null ? void 0 : ui.updateState(currentState, elapsedSeconds);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to access microphone";
      ui == null ? void 0 : ui.toast(message, true);
      recorder = null;
    }
  }
  async function stopAndTranscribe() {
    if (!recorder) {
      return;
    }
    stopTimer();
    currentState = "processing";
    ui == null ? void 0 : ui.updateState(currentState);
    try {
      const audioBlob = await recorder.stop();
      const config = getConfig();
      const result = await transcribe(audioBlob, config);
      if (result.text) {
        const inserted = insertText(result.text);
        if (!inserted) {
          ui == null ? void 0 : ui.toast("Could not find input field", true);
        } else if (config.autoSubmit) {
          submitPrompt();
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Transcription failed";
      ui == null ? void 0 : ui.toast(message, true);
    } finally {
      currentState = "idle";
      elapsedSeconds = 0;
      recorder = null;
      ui == null ? void 0 : ui.updateState(currentState);
    }
  }
  function promptForApiKey() {
    const key = prompt("Enter your Groq API key (get one free at console.groq.com/keys):", "");
    if (key && validateApiKey(key)) {
      setConfig({ groqApiKey: key.trim() });
      ui == null ? void 0 : ui.toast("API key saved!");
    } else if (key) {
      ui == null ? void 0 : ui.toast("Invalid key format. Must start with 'gsk_'", true);
    }
  }
  function promptForModel() {
    const model = prompt(
      "Whisper model (whisper-large-v3 or whisper-large-v3-turbo):",
      getConfig().model
    );
    if (model && (model === "whisper-large-v3" || model === "whisper-large-v3-turbo")) {
      setConfig({ model });
      ui == null ? void 0 : ui.toast(`Model set to ${model}`);
    } else if (model) {
      ui == null ? void 0 : ui.toast("Invalid model name", true);
    }
  }
  function promptForLanguage() {
    const lang = prompt(
      "Language code (empty for auto-detect, e.g. 'ru', 'en'):",
      getConfig().language
    );
    if (lang !== null) {
      setConfig({ language: lang.trim() });
      ui == null ? void 0 : ui.toast(lang.trim() ? `Language set to ${lang}` : "Auto-detect enabled");
    }
  }
  function promptForWhisperPrompt() {
    const text = prompt("Whisper prompt (context for transcription):", getConfig().whisperPrompt);
    if (text !== null) {
      setConfig({ whisperPrompt: text });
      ui == null ? void 0 : ui.toast("Whisper prompt updated");
    }
  }
  function toggleAutoSubmit() {
    const config = getConfig();
    setConfig({ autoSubmit: !config.autoSubmit });
    ui == null ? void 0 : ui.toast(`Auto-submit ${!config.autoSubmit ? "enabled" : "disabled"}`);
  }
  function checkFirstRun() {
    if (isFirstRun()) {
      setTimeout(() => {
        ui == null ? void 0 : ui.toast("First run: Set your Groq API key via the Violentmonkey/Tampermonkey menu");
      }, 2e3);
    }
  }
  function init() {
    if (!isOpencodePage()) {
      setTimeout(init, 1500);
      return;
    }
    ui = setupUI(toggleDictation);
    setupKeyboardShortcut(() => {
      void toggleDictation();
    });
    registerMenuCommands({
      onSetKey: promptForApiKey,
      onToggleAutoSubmit: toggleAutoSubmit,
      onSetModel: promptForModel,
      onSetLanguage: promptForLanguage,
      onSetPrompt: promptForWhisperPrompt
    });
    checkFirstRun();
  }
  init();

})();