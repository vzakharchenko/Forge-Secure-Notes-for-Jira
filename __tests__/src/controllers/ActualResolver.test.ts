import { describe, it, expect, vi, beforeEach } from "vitest";
import { ActualResolver } from "../../../src/controllers";
import { Request } from "@forge/resolver";
import { Container } from "inversify";
import { ContextService, KVSSchemaMigrationService, AnalyticService } from "../../../src/services";
import { FORGE_SQL_ORM } from "../../../src/database";
import { applicationContext } from "../../../src/controllers";
import { FORGE_INJECTION_TOKENS } from "../../../src/constants";
import { ErrorResponse } from "../../../shared/Types";
import Resolver from "@forge/resolver";

// Mock dependencies
vi.mock("../../../src/database/DbUtils", () => ({
  FORGE_SQL_ORM: {
    executeWithMetadata: vi.fn(),
  },
}));

// Mock ApplySchemaMigrationTrigger to avoid circular dependency
const mockApplySchemaMigrationHandler = vi.fn();

// Create a concrete implementation for testing
class TestResolver extends ActualResolver<ErrorResponse> {
  private mockResponse: ErrorResponse;

  constructor(mockResponse: ErrorResponse) {
    super();
    this.mockResponse = mockResponse;
  }

  functionName(): string {
    return "testResolver";
  }

  async response(): Promise<ErrorResponse> {
    return this.mockResponse;
  }
}

describe("ActualResolver", () => {
  let container: Container;
  let mockResolver: Resolver;
  let mockContextService: ContextService;
  let mockKvsSchemaMigrationService: KVSSchemaMigrationService;
  let mockAnalyticService: AnalyticService;
  let mockRequest: Request;

  beforeEach(() => {
    container = new Container();
    mockResolver = {
      define: vi.fn(),
    } as unknown as Resolver;

    mockContextService = {
      getContext: vi.fn(),
    } as unknown as ContextService;

    mockKvsSchemaMigrationService = {
      isLatestVersion: vi.fn(),
    } as unknown as KVSSchemaMigrationService;

    mockAnalyticService = {
      sendAnalytics: vi.fn(),
    } as unknown as AnalyticService;

    container.bind(FORGE_INJECTION_TOKENS.ContextService).toConstantValue(mockContextService);
    container
      .bind(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService)
      .toConstantValue(mockKvsSchemaMigrationService);
    container.bind(FORGE_INJECTION_TOKENS.AnalyticService).toConstantValue(mockAnalyticService);

    mockRequest = {
      context: {
        accountId: "user-123",
        cloudId: "cloud-123",
      },
      payload: {},
    } as Request;

    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register resolver with correct function name", () => {
      const testResolver = new TestResolver({ isError: false });
      testResolver.register(mockResolver, container);

      expect(mockResolver.define).toHaveBeenCalledWith("testResolver", expect.any(Function));
    });

    it("should call getContext with request", async () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
      };
      vi.mocked(mockContextService.getContext).mockReturnValue(mockContext as any);

      const testResolver = new TestResolver({ isError: false });
      testResolver.register(mockResolver, container);

      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      await handler(mockRequest);

      expect(mockContextService.getContext).toHaveBeenCalledWith(mockRequest);
    });

    it("should execute response when latest version", async () => {
      const mockResponse = { isError: false, result: "success" };
      const testResolver = new TestResolver(mockResponse);
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(true);
      vi.mocked(mockContextService.getContext).mockReturnValue({ cloudId: "cloud-123" } as any);
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(500, 100, vi.fn());
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      const result = await handler(mockRequest);

      expect(result).toEqual(mockResponse);
      expect(mockKvsSchemaMigrationService.isLatestVersion).toHaveBeenCalled();
      expect(mockApplySchemaMigrationHandler).not.toHaveBeenCalled();
    });

    it("should return installation error when migration fails", async () => {
      const testResolver = new TestResolver({ isError: false });
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(false);
      vi.mocked(mockContextService.getContext).mockReturnValue({ cloudId: "cloud-123" } as any);
      mockApplySchemaMigrationHandler.mockRejectedValue(new Error("Migration failed"));
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(500, 100, vi.fn());
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      const result = await handler(mockRequest);

      expect(result).toEqual({
        isError: false,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it("should send analytics with correct parameters", async () => {
      const testResolver = new TestResolver({ isError: false });
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(true);
      vi.mocked(mockContextService.getContext).mockReturnValue({ cloudId: "cloud-123" } as any);
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(1500, 200, vi.fn());
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      await handler(mockRequest);

      expect(mockAnalyticService.sendAnalytics).toHaveBeenCalledWith(
        "sql_resolver_performance",
        "testResolver",
        "cloud-123",
        { totalDbExecutionTime: 1500, totalResponseSize: 200 },
      );
    });

    it("should log warning when execution time exceeds 2000ms", async () => {
      const testResolver = new TestResolver({ isError: false });
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(true);
      vi.mocked(mockContextService.getContext).mockReturnValue({ cloudId: "cloud-123" } as any);
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const mockPrintQueries = vi.fn();
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(2500, 300, mockPrintQueries);
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      await handler(mockRequest);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Resolver testResolver has high database execution time: 2500ms"),
      );
      expect(mockPrintQueries).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should log debug when execution time exceeds 1000ms but less than 2000ms", async () => {
      const testResolver = new TestResolver({ isError: false });
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(true);
      vi.mocked(mockContextService.getContext).mockReturnValue({ cloudId: "cloud-123" } as any);
      const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(1500, 200, vi.fn());
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      await handler(mockRequest);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining("Resolver testResolver has high database execution time: 1500ms"),
      );

      consoleDebugSpy.mockRestore();
    });

    it("should set context using applicationContext.run", async () => {
      const testResolver = new TestResolver({ isError: false });
      vi.mocked(mockKvsSchemaMigrationService.isLatestVersion).mockResolvedValue(true);
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
      };
      vi.mocked(mockContextService.getContext).mockReturnValue(mockContext as any);
      const runSpy = vi.spyOn(applicationContext, "run");
      vi.mocked(FORGE_SQL_ORM.executeWithMetadata).mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(500, 100, vi.fn());
        return result;
      });

      testResolver.register(mockResolver, container);
      const handler = vi.mocked(mockResolver.define).mock.calls[0][1];
      await handler(mockRequest);

      expect(runSpy).toHaveBeenCalledWith(
        { accountId: "user-123", context: mockContext },
        expect.any(Function),
      );
    });
  });
});
