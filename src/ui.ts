import type { DictationState } from "./types.js";

const BUTTON_ID = "opencode-voice-dictation-btn";
const COMPOSER_SELECTORS = [
  '[data-component="session-composer"]',
  '[data-component="session-new-composer"]',
];

function createButtonStyle(): string {
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

function injectStyles(): void {
  if (document.getElementById("opencode-voice-dictation-style")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "opencode-voice-dictation-style";
  style.textContent = createButtonStyle();
  document.head.appendChild(style);
}

function showToast(message: string, isError = false): void {
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
  }, 4000);
}

function createButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.type = "button";
  button.title = "Voice Dictation (Ctrl+Space)";
  button.innerHTML = "&#127908;";
  return button;
}

function updateButtonState(
  button: HTMLButtonElement,
  state: DictationState,
  elapsedSeconds = 0,
): void {
  button.classList.remove("recording", "processing");

  switch (state) {
    case "idle":
      button.innerHTML = "&#127908;";
      button.title = "Voice Dictation (Ctrl+Space)";
      break;
    case "recording":
      button.classList.add("recording");
      button.innerHTML = `<span class="timer">${formatTimer(elapsedSeconds)}</span>&#9209;`;
      button.title = "Stop recording";
      break;
    case "processing":
      button.classList.add("processing");
      button.innerHTML = "&#8987;";
      button.title = "Transcribing...";
      break;
  }
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function findComposer(): HTMLElement | null {
  for (const selector of COMPOSER_SELECTORS) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      return el;
    }
  }
  return null;
}

function isButtonInjected(): boolean {
  return document.getElementById(BUTTON_ID) !== null;
}

function injectButton(onToggle: () => void): void {
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

export function setupUI(
  onToggle: () => void,
  getState: () => DictationState,
): {
  inject: () => void;
  updateState: (state: DictationState, elapsedSeconds?: number) => void;
  toast: (message: string, isError?: boolean) => void;
} {
  const observer = new MutationObserver(() => {
    injectButton(onToggle);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  injectButton(onToggle);

  return {
    inject: () => injectButton(onToggle),
    updateState: (state: DictationState, elapsedSeconds = 0) => {
      const button = document.getElementById(BUTTON_ID) as HTMLButtonElement | null;
      if (button) {
        updateButtonState(button, state, elapsedSeconds);
      }
    },
    toast: showToast,
  };
}
