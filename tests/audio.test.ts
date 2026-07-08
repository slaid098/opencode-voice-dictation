import { describe, expect, it } from "vitest";
import { formatTime } from "../src/audio.js";

describe("formatTime", () => {
  it("should format 0 seconds as 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("should format seconds under a minute", () => {
    expect(formatTime(5)).toBe("00:05");
    expect(formatTime(30)).toBe("00:30");
    expect(formatTime(59)).toBe("00:59");
  });

  it("should format exactly one minute", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  it("should format minutes and seconds", () => {
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(125)).toBe("02:05");
    expect(formatTime(599)).toBe("09:59");
    expect(formatTime(600)).toBe("10:00");
  });

  it("should pad single digits with leading zero", () => {
    expect(formatTime(1)).toBe("00:01");
    expect(formatTime(61)).toBe("01:01");
  });
});
