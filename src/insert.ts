const PROMPT_INPUT_SELECTOR = '[data-component="prompt-input"]';
const SUBMIT_SELECTOR = '[data-action="prompt-submit"]';

export function isOpencodePage(): boolean {
  return document.querySelector(PROMPT_INPUT_SELECTOR) !== null;
}

export function insertText(text: string): boolean {
  const input = document.querySelector<HTMLElement>(PROMPT_INPUT_SELECTOR);
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

export function submitPrompt(): boolean {
  const submitButton = document.querySelector<HTMLElement>(SUBMIT_SELECTOR);
  if (!submitButton) {
    return false;
  }
  submitButton.click();
  return true;
}
