import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  applicationContext,
  getAppContext,
  withAppContext,
  AppContext,
} from "../../../src/controllers/ApplicationContext";
import { BaseContext } from "../../../src/core";

describe("ApplicationContext", () => {
  beforeEach(() => {
    // Note: AsyncLocalStorage doesn't have disable/enable methods
    // Context is automatically cleared when run completes
  });

  describe("applicationContext", () => {
    it("should be an instance of AsyncLocalStorage", () => {
      expect(applicationContext).toBeDefined();
      expect(typeof applicationContext.run).toBe("function");
      expect(typeof applicationContext.getStore).toBe("function");
    });

    it("should store and retrieve context using run", async () => {
      const mockContext: AppContext = {
        accountId: "user-123",
        context: {
          accountId: "user-123",
          localId: "local-123",
          cloudId: "cloud-123",
          moduleKey: "module-key",
          extension: {
            type: "jira:globalPage",
          },
          environmentId: "env-123",
          environmentType: "production",
          siteUrl: "https://example.atlassian.net",
          timezone: "UTC",
        } as BaseContext,
      };

      await applicationContext.run(mockContext, async () => {
        const stored = applicationContext.getStore();
        expect(stored).toEqual(mockContext);
        expect(stored?.accountId).toBe("user-123");
      });
    });

    it("should return undefined when context is not set", () => {
      const stored = applicationContext.getStore();
      expect(stored).toBeUndefined();
    });
  });

  describe("getAppContext", () => {
    it("should return undefined when no context is set", () => {
      const context = getAppContext();
      expect(context).toBeUndefined();
    });

    it("should return context when set via run", async () => {
      const mockContext: AppContext = {
        accountId: "user-123",
        context: {
          accountId: "user-123",
          localId: "local-123",
          cloudId: "cloud-123",
          moduleKey: "module-key",
          extension: {
            type: "jira:globalPage",
          },
          environmentId: "env-123",
          environmentType: "production",
          siteUrl: "https://example.atlassian.net",
          timezone: "UTC",
        } as BaseContext,
      };

      await applicationContext.run(mockContext, async () => {
        const context = getAppContext();
        expect(context).toEqual(mockContext);
        expect(context?.accountId).toBe("user-123");
      });
    });
  });

  describe("withAppContext decorator", () => {
    it("should wrap method and pass context as last argument", async () => {
      const mockContext: AppContext = {
        accountId: "user-123",
        context: {
          accountId: "user-123",
          localId: "local-123",
          cloudId: "cloud-123",
          moduleKey: "module-key",
          extension: {
            type: "jira:globalPage",
          },
          environmentId: "env-123",
          environmentType: "production",
          siteUrl: "https://example.atlassian.net",
          timezone: "UTC",
        } as BaseContext,
      };

      class TestClass {
        @withAppContext()
        async testMethod(
          arg1: string,
          arg2: number,
          context?: AppContext,
        ): Promise<{ arg1: string; arg2: number; context?: AppContext }> {
          return { arg1, arg2, context };
        }
      }

      const instance = new TestClass();

      await applicationContext.run(mockContext, async () => {
        const result = await instance.testMethod("test", 42);
        expect(result.arg1).toBe("test");
        expect(result.arg2).toBe(42);
        expect(result.context).toEqual(mockContext);
      });
    });

    it("should throw error when context is not set", async () => {
      class TestClass {
        @withAppContext()
        async testMethod(): Promise<void> {
          // This should not be called
        }
      }

      const instance = new TestClass();
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(instance.testMethod()).rejects.toThrow(
        "Context is not set for method testMethod",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Context is not set for method testMethod"),
      );

      consoleErrorSpy.mockRestore();
    });

    it("should preserve method name in error message", async () => {
      class TestClass {
        @withAppContext()
        async myCustomMethod(): Promise<void> {
          // This should not be called
        }
      }

      const instance = new TestClass();
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(instance.myCustomMethod()).rejects.toThrow(
        "Context is not set for method myCustomMethod",
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Context is not set for method myCustomMethod"),
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
