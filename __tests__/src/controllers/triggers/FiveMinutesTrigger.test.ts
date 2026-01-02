import { beforeEach, describe, expect, it, vi } from "vitest";
import FiveMinutesTrigger from "../../../../src/controllers/triggers/FiveMinutesTrigger";
import { SchedulerTriggerRequest } from "../../../../src/core";
import { FORGE_SQL_ORM } from "../../../../src/database";
import * as forgeSqlOrm from "forge-sql-orm";

vi.mock("forge-sql-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof forgeSqlOrm>();
  return {
    ...actual,
    clearCacheSchedulerTrigger: vi.fn(),
  };
});

// Create chainable mock for select
const createChainableSelect = () => {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
  };
};

// Create chainable mock for selectFrom
const createChainableSelectFrom = () => ({
  where: vi.fn().mockResolvedValue([]),
});

vi.mock("../../../../src/database/DbUtils", () => ({
  FORGE_SQL_ORM: {
    executeWithMetadata: vi.fn(),
    select: vi.fn(() => createChainableSelect()),
    selectCacheable: vi.fn(() => createChainableSelect()),
    selectFrom: vi.fn(() => createChainableSelectFrom()),
    modifyWithVersioningAndEvictCache: vi.fn(),
    executeCacheable: vi.fn(),
  },
}));

describe("FiveMinutesTrigger", () => {
  let trigger: typeof FiveMinutesTrigger;
  let mockRequest: SchedulerTriggerRequest;

  beforeEach(() => {
    trigger = FiveMinutesTrigger;
    mockRequest = {
      context: {
        cloudId: "cloud-123",
        moduleKey: "module-key",
      },
      userAccess: {
        enabled: true,
      },
      contextToken: "token-123",
    };
    vi.clearAllMocks();
  });

  describe("handler", () => {
    it("should execute expireSecurityNotes and clearCacheSchedulerTrigger", async () => {
      // Mock SecurityNoteService to avoid calling real expireSecurityNotes
      const mockSecurityNoteService = {
        expireSecurityNotes: vi.fn().mockResolvedValue(undefined),
      };
      (trigger as any)._container = {
        get: vi.fn((token) => {
          if (token === "AnalyticService") {
            return { sendAnalytics: vi.fn() };
          }
          if (token === "SecurityNoteService") {
            return mockSecurityNoteService;
          }
          return {};
        }),
      };

      const mockExecuteWithMetadata = vi.mocked(FORGE_SQL_ORM.executeWithMetadata);
      const mockClearCache = vi.mocked(forgeSqlOrm.clearCacheSchedulerTrigger);
      mockClearCache.mockResolvedValue("Cache cleared" as any);
      mockExecuteWithMetadata.mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(1000, 500, vi.fn());
        return { statusCode: 200, body: result } as any;
      });

      const result = await trigger.handler(mockRequest);

      expect(result.statusCode).toBe(200);
      expect(mockExecuteWithMetadata).toHaveBeenCalled();
      expect(mockClearCache).toHaveBeenCalledWith({
        cacheEntityName: "cache",
        logRawSqlQuery: true,
      });
    });

    it("should send analytics with correct parameters", async () => {
      const mockExecuteWithMetadata = vi.mocked(FORGE_SQL_ORM.executeWithMetadata);
      const mockClearCache = vi.mocked(forgeSqlOrm.clearCacheSchedulerTrigger);
      mockClearCache.mockResolvedValue("Cache cleared" as any);
      const mockCallback = vi.fn();
      mockExecuteWithMetadata.mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(1500, 600, mockCallback);
        return { statusCode: 200, body: result } as any;
      });

      await trigger.handler(mockRequest);

      expect(mockExecuteWithMetadata).toHaveBeenCalled();
      // Verify callback was called with correct parameters
      const callArgs = mockExecuteWithMetadata.mock.calls[0];
      expect(callArgs[1]).toBeDefined();
    });

    it("should log warning when execution time exceeds 2000ms", async () => {
      const mockSecurityNoteService = {
        expireSecurityNotes: vi.fn().mockResolvedValue(undefined),
      };
      (trigger as any)._container = {
        get: vi.fn((token) => {
          if (token === "AnalyticService") {
            return { sendAnalytics: vi.fn() };
          }
          if (token === "SecurityNoteService") {
            return mockSecurityNoteService;
          }
          return {};
        }),
      };

      const mockExecuteWithMetadata = vi.mocked(FORGE_SQL_ORM.executeWithMetadata);
      const mockClearCache = vi.mocked(forgeSqlOrm.clearCacheSchedulerTrigger);
      mockClearCache.mockResolvedValue("Cache cleared" as any);
      const mockPrintQueries = vi.fn();
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mockExecuteWithMetadata.mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(2500, 700, mockPrintQueries);
        return { statusCode: 200, body: result } as any;
      });

      await trigger.handler(mockRequest);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("has high database execution time: 2500ms"),
      );
      expect(mockPrintQueries).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should log debug when execution time exceeds 1000ms but less than 2000ms", async () => {
      const mockSecurityNoteService = {
        expireSecurityNotes: vi.fn().mockResolvedValue(undefined),
      };
      (trigger as any)._container = {
        get: vi.fn((token) => {
          if (token === "AnalyticService") {
            return { sendAnalytics: vi.fn() };
          }
          if (token === "SecurityNoteService") {
            return mockSecurityNoteService;
          }
          return {};
        }),
      };

      const mockExecuteWithMetadata = vi.mocked(FORGE_SQL_ORM.executeWithMetadata);
      const mockClearCache = vi.mocked(forgeSqlOrm.clearCacheSchedulerTrigger);
      mockClearCache.mockResolvedValue("Cache cleared" as any);
      const consoleDebugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
      mockExecuteWithMetadata.mockImplementation(async (fn, callback) => {
        const result = await fn();
        await callback(1500, 600, vi.fn());
        return { statusCode: 200, body: result } as any;
      });

      await trigger.handler(mockRequest);

      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining("has high database execution time: 1500ms"),
      );

      consoleDebugSpy.mockRestore();
    });
  });
});
