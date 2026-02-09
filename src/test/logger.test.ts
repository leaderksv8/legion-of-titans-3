import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "@/shared/lib/logger";

describe("Logger Utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("has debug method", () => {
    expect(typeof logger.debug).toBe("function");
  });

  it("has info method", () => {
    expect(typeof logger.info).toBe("function");
  });

  it("has warn method", () => {
    expect(typeof logger.warn).toBe("function");
  });

  it("has error method", () => {
    expect(typeof logger.error).toBe("function");
  });

  it("logger methods are callable without errors", () => {
    expect(() => {
      logger.debug("test message");
      logger.info("test message");
      logger.warn("test message");
      logger.error("test message");
    }).not.toThrow();
  });

  it("logger handles objects as data parameter", () => {
    const testData = { key: "value", number: 123 };
    expect(() => {
      logger.debug("test", testData);
      logger.info("test", testData);
    }).not.toThrow();
  });
});
