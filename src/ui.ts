import type { DictationState } from "./types.js";

const BUTTON_ID = "opencode-voice-dictation-btn";
const CONTAINER_ID = "opencode-voice-dictation-container";
const TIMER_ID = "opencode-voice-dictation-timer";
const COMPOSER_SELECTORS = [
  '[data-component="session-composer"]',
  '[data-component="session-new-composer"]',
];

const ICON_MIC = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>`;
const ICON_STOP = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="3"/></svg>`;
const ICON_SPINNER = `<svg class="ocvd-spin" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/></svg>`;

function createButtonStyle(): string {
  return `
    #${CONTAINER_ID} {
      position: absolute !important;
      top: 8px;
      right: 8px;
      z-index: 999998;
      display: flex;
      align-items: center;
      gap: 6px;
      pointer-events: none;
    }
    #${CONTAINER_ID} > * {
      pointer-events: auto;
    }
    #${BUTTON_ID} {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: var(--color-bg-tertiary, rgba(128, 128, 128, 0.15));
      color: var(--color-text-secondary, #888);
      cursor: pointer;
      transition: all 0.2s ease;
      padding: 0;
      flex-shrink: 0;
    }
    #${BUTTON_ID}:hover {
      background: var(--color-bg-hover, rgba(128, 128, 128, 0.25));
      color: var(--color-text-primary, #fff);
    }
    #${BUTTON_ID}.recording {
      background: #e53935;
      color: #fff;
      animation: ocvd-pulse 1.5s ease-in-out infinite;
    }
    #${BUTTON_ID}.processing {
      background: var(--color-accent, #4a9eff);
      color: #fff;
      pointer-events: none;
      opacity: 0.8;
    }
    #${TIMER_ID} {
      display: none;
      font-family: monospace;
      font-size: 13px;
      font-weight: 600;
      color: #e53935;
      background: rgba(229, 57, 53, 0.1);
      padding: 3px 10px;
      border-radius: 12px;
      align-items: center;
      gap: 5px;
      line-height: 1;
      white-space: nowrap;
    }
    #${TIMER_ID}.visible {
      display: inline-flex;
    }
    #${TIMER_ID}::before {
      content: "";
      width: 7px;
      height: 7px;
      background: #e53935;
      border-radius: 50%;
      animation: ocvd-blink 1s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes ocvd-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(229, 57, 53, 0.4); }
      50% { box-shadow: 0 0 0 6px rgba(229, 57, 53, 0); }
    }
    @keyframes ocvd-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes ocvd-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .ocvd-spin {
      animation: ocvd-spin 0.8s linear infinite;
      transform-origin: center;
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

function createContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.id = CONTAINER_ID;

  const timer = document.createElement("span");
  timer.id = TIMER_ID;
  timer.textContent = "00:00";

  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.type = "button";
  button.title = "Voice Dictation (Ctrl+Space)";
  button.innerHTML = ICON_MIC;

  container.appendChild(timer);
  container.appendChild(button);

  return container;
}

function updateButtonState(
  button: HTMLButtonElement,
  timer: HTMLElement,
  state: DictationState,
  elapsedSeconds = 0,
): void {
  button.classList.remove("recording", "processing");
  timer.classList.remove("visible");

  switch (state) {
    case "idle":
      button.innerHTML = ICON_MIC;
      button.title = "Voice Dictation (Ctrl+Space)";
      break;
    case "recording":
      button.classList.add("recording");
      button.innerHTML = ICON_STOP;
      button.title = "Stop recording";
      timer.textContent = formatTimer(elapsedSeconds);
      timer.classList.add("visible");
      break;
    case "processing":
      button.classList.add("processing");
      button.innerHTML = ICON_SPINNER;
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

function isContainerInjected(): boolean {
  return document.getElementById(CONTAINER_ID) !== null;
}

function injectButton(onToggle: () => void): void {
  if (isContainerInjected()) {
    return;
  }

  const composer = findComposer();
  if (!composer) {
    return;
  }

  injectStyles();

  const computedPosition = window.getComputedStyle(composer).position;
  if (computedPosition === "static") {
    composer.style.position = "relative";
  }

  const container = createContainer();
  const button = container.querySelector(`#${BUTTON_ID}`) as HTMLButtonElement;
  button.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  });

  composer.appendChild(container);
}

export function setupUI(
  onToggle: () => void,
  _getState: () => DictationState,
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
      const timer = document.getElementById(TIMER_ID);
      if (button && timer) {
        updateButtonState(button, timer, state, elapsedSeconds);
      }
    },
    toast: showToast,
  };
}
