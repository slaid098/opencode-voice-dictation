import { afterEach, describe, expect, it } from "vitest";
import { setupKeyboardShortcut } from "../src/keyboard.js";

describe("setupKeyboardShortcut", () => {
  let cleanup: (() => void) | null = null;

  afterEach(() => {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  });

  it("should call callback on ctrl+space", () => {
    let called = false;
    cleanup = setupKeyboardShortcut(() => {
      called = true;
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: " ", ctrlKey: true }));

    expect(called).toBe(true);
  });

  it("should not call callback on space without ctrl", () => {
    let called = false;
    cleanup = setupKeyboardShortcut(() => {
      called = true;
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));

    expect(called).toBe(false);
  });

  it("should not call callback on ctrl+other key", () => {
    let called = false;
    cleanup = setupKeyboardShortcut(() => {
      called = true;
    });

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a", ctrlKey: true }));

    expect(called).toBe(false);
  });

  it("should cleanup listener on dispose", () => {
    let called = false;
    const dispose = setupKeyboardShortcut(() => {
      called = true;
    });

    dispose();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: " ", ctrlKey: true }));

    expect(called).toBe(false);
  });

  it("should prevent default on match", () => {
    let prevented = false;
    cleanup = setupKeyboardShortcut(() => {});

    const event = new KeyboardEvent("keydown", {
      key: " ",
      ctrlKey: true,
      cancelable: true,
    });
    event.preventDefault = () => {
      prevented = true;
    };

    document.dispatchEvent(event);
    expect(prevented).toBe(true);
  });
});
