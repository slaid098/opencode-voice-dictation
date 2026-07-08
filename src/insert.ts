const PROMPT_INPUT_SELECTOR = '[data-component="prompt-input"]';
const SUBMIT_SELECTOR = '[data-action="prompt-submit"]';
const QUESTION_INPUT_SELECTOR = '[data-slot="question-custom-input"]';

export type InsertTarget = "composer" | "question";

export function isOpencodePage(): boolean {
  return document.querySelector(PROMPT_INPUT_SELECTOR) !== null;
}

export function insertText(text: string, target: InsertTarget = "composer"): boolean {
  if (target === "question") {
    return insertIntoTextarea(text);
  }
  return insertIntoContenteditable(text);
}

function insertIntoContenteditable(text: string): boolean {
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

function insertIntoTextarea(text: string): boolean {
  const textarea = document.querySelector<HTMLTextAreaElement>(QUESTION_INPUT_SELECTOR);
  if (!textarea) {
    return false;
  }

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newValue = textarea.value.substring(0, start) + text + textarea.value.substring(end);

  textarea.value = newValue;
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.focus();

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
