import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { insertText, isOpencodePage, submitPrompt } from "../src/insert.js";

beforeEach(() => {
  document.execCommand = vi.fn(() => true);
});

describe("isOpencodePage", () => {
  it("should return false when prompt-input not present", () => {
    document.body.innerHTML = "";
    expect(isOpencodePage()).toBe(false);
  });

  it("should return true when prompt-input is present", () => {
    document.body.innerHTML =
      '<div data-component="prompt-input" contenteditable="true" role="textbox"></div>';
    expect(isOpencodePage()).toBe(true);
  });
});

describe("insertText", () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div data-component="prompt-input" contenteditable="true" role="textbox"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return false when input not found", () => {
    document.body.innerHTML = "";
    expect(insertText("hello")).toBe(false);
  });

  it("should call execCommand with insertText", () => {
    const result = insertText("hello world");
    expect(result).toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith("insertText", false, "hello world");
  });

  it("should dispatch input event", () => {
    let eventCount = 0;
    const input = document.querySelector('[data-component="prompt-input"]') as HTMLElement;
    input.addEventListener("input", () => {
      eventCount++;
    });

    insertText("test text");
    expect(eventCount).toBeGreaterThanOrEqual(1);
  });
});

describe("submitPrompt", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should return false when submit button not found", () => {
    expect(submitPrompt()).toBe(false);
  });

  it("should click submit button when found", () => {
    let clicked = false;
    const btn = document.createElement("button");
    btn.setAttribute("data-action", "prompt-submit");
    btn.addEventListener("click", () => {
      clicked = true;
    });
    document.body.appendChild(btn);

    expect(submitPrompt()).toBe(true);
    expect(clicked).toBe(true);
  });
});
