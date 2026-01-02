import { describe, it, expect, vi, beforeEach } from "vitest";
import "reflect-metadata";
import { exceptionHandler, exceptionHandlerTrigger } from "../../../../src/core";
import { resolver } from "../../../../src/core";
import { schedulerTrigger } from "../../../../src/core";
import { ActualResolver } from "../../../../src/controllers";
import { ErrorResponse } from "../../../../shared/Types";
import {
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerContext,
} from "../../../../src/core";

describe("ExceptionHandlerDecorator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("exceptionHandler", () => {
    it("should catch and return error response when exception occurs", async () => {
      @resolver
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }

        @exceptionHandler()
        async testMethod(): Promise<ErrorResponse> {
          throw new Error("Test error");
        }
      }

      const instance = new TestResolver();
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await instance.testMethod();

      expect(result.isError).toBe(true);
      expect(result.errorType).toBe("GENERAL");
      expect(result.message).toBe("Test error");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should return original result when no exception occurs", async () => {
      @resolver
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }

        @exceptionHandler()
        async testMethod(): Promise<ErrorResponse> {
          return { isError: false, data: "success" };
        }
      }

      const instance = new TestResolver();

      const result = await instance.testMethod();

      expect(result.isError).toBe(false);
      expect(result.data).toBe("success");
    });

    it("should use error.cause if available", async () => {
      @resolver
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }

        @exceptionHandler()
        async testMethod(): Promise<ErrorResponse> {
          const error = new Error("Cause error");
          const wrapper = new Error("Wrapper error");
          (wrapper as any).cause = error;
          throw wrapper;
        }
      }

      const instance = new TestResolver();
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await instance.testMethod();

      expect(result.isError).toBe(true);
      expect(result.message).toBe("Cause error");

      consoleSpy.mockRestore();
    });

    it("should log SQL debug information when error has debug property", async () => {
      @resolver
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }

        @exceptionHandler()
        async testMethod(): Promise<ErrorResponse> {
          const error = new Error("SQL error");
          (error as any).debug = { query: "SELECT * FROM table" };
          throw error;
        }
      }

      const instance = new TestResolver();
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await instance.testMethod();

      expect(result.isError).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('SQL Error :{"query":"SELECT * FROM table"}'),
      );

      consoleSpy.mockRestore();
    });

    it("should throw error when used without @resolver decorator", async () => {
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }

        @exceptionHandler()
        async testMethod(): Promise<ErrorResponse> {
          return { isError: false };
        }
      }

      const instance = new TestResolver();

      await expect(instance.testMethod()).rejects.toThrow(
        "Error: @exceptionHandler can use only with @resolver.",
      );
    });
  });

  describe("exceptionHandlerTrigger", () => {
    it("should catch and return error response when exception occurs", async () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        @exceptionHandlerTrigger()
        async handler() {
          throw new Error("Test error");
        }
      }

      const instance = new TestSchedulerTrigger();
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockRequest: SchedulerTriggerRequest = {
        context: { cloudId: "cloud-123", moduleKey: "module-key" },
        userAccess: { enabled: true },
        contextToken: "token",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      const result = await instance.handler(mockRequest, mockContext);

      expect(result.statusCode).toBe(500);
      expect(result.statusText).toBe("Bad Request");
      expect(result.body).toBe("Test error");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should use custom error message when provided", async () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        @exceptionHandlerTrigger("Custom error message")
        async handler() {
          throw new Error("Test error");
        }
      }

      const instance = new TestSchedulerTrigger();
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const mockRequest: SchedulerTriggerRequest = {
        context: { cloudId: "cloud-123", moduleKey: "module-key" },
        userAccess: { enabled: true },
        contextToken: "token",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      const result = await instance.handler(mockRequest, mockContext);

      expect(result.statusCode).toBe(500);
      expect(result.body).toBe("Custom error message");

      consoleSpy.mockRestore();
    });

    it("should return original result when no exception occurs", async () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        @exceptionHandlerTrigger()
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      const instance = new TestSchedulerTrigger();
      const mockRequest: SchedulerTriggerRequest = {
        context: { cloudId: "cloud-123", moduleKey: "module-key" },
        userAccess: { enabled: true },
        contextToken: "token",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      const result = await instance.handler(mockRequest, mockContext);

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("Success");
    });

    it("should throw error for SQL debug errors", async () => {
      @schedulerTrigger
      class TestSchedulerTrigger extends SchedulerTrigger {
        @exceptionHandlerTrigger()
        async handler() {
          const error = new Error("SQL error");
          (error as any).debug = { query: "SELECT * FROM table" };
          throw error;
        }
      }

      const instance = new TestSchedulerTrigger();
      const mockRequest: SchedulerTriggerRequest = {
        context: { cloudId: "cloud-123", moduleKey: "module-key" },
        userAccess: { enabled: true },
        contextToken: "token",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      await expect(instance.handler(mockRequest, mockContext)).rejects.toThrow(
        'SQL Error :{"query":"SELECT * FROM table"}',
      );
    });

    it("should throw error when used without @schedulerTrigger decorator", async () => {
      class TestSchedulerTrigger extends SchedulerTrigger {
        @exceptionHandlerTrigger()
        async handler() {
          return { statusCode: 200, body: "Success" };
        }
      }

      const instance = new TestSchedulerTrigger();
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const mockRequest: SchedulerTriggerRequest = {
        context: { cloudId: "cloud-123", moduleKey: "module-key" },
        userAccess: { enabled: true },
        contextToken: "token",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      await expect(instance.handler(mockRequest, mockContext)).rejects.toThrow(
        "Error: @exceptionHandlerTrigger can use only with @schedulerTrigger.",
      );

      consoleSpy.mockRestore();
    });
  });
});
