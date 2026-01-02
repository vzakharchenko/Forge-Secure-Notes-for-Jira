import { describe, it, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import { AsyncEvent } from "@forge/events";
import {
  handlerIssue,
  handlerGlobal,
  handlerAdmin,
  handlerFiveMinute,
  runSlowQuery,
  handlerMigration,
  dropMigrations,
  fetchMigrations,
  runSecurityNotesQuery,
  handlerAsyncDegradation,
} from "../../src";
import { SchedulerTriggerRequest } from "../../src/core";
import { FORGE_INJECTION_TOKENS } from "../../src/constants";
import * as controllers from "../../src/controllers";
import * as forgeSqlOrm from "forge-sql-orm";
import * as cryptoUtils from "../../src/core/utils/cryptoUtils";

// Mock @forge/resolver
vi.mock("@forge/resolver", () => {
  const mockGetDefinitions = vi.fn().mockReturnValue({});
  const mockDefine = vi.fn();

  class MockResolver {
    define = mockDefine;
    getDefinitions = mockGetDefinitions;
  }
  return {
    default: MockResolver,
  };
});

// Mock resolvers
vi.mock("../../src/resolvers", () => ({
  issue: vi.fn(),
  global: vi.fn(),
  admin: vi.fn(),
}));

// Mock controllers
vi.mock("../../src/controllers", () => {
  const mockFiveMinuteHandler = vi.fn();
  const mockSlowQueryHandler = vi.fn();
  const mockApplyMigrationHandler = vi.fn();
  const mockDropMigrationHandler = vi.fn();

  return {
    FiveMinutesTrigger: {
      handler: mockFiveMinuteHandler,
    },
    SlowQueryTriggerTrigger: {
      handler: mockSlowQueryHandler,
    },
    ApplySchemaMigrationTrigger: {
      handler: mockApplyMigrationHandler,
    },
    DropSchemaMigrationTrigger: {
      handler: mockDropMigrationHandler,
    },
    __mocks: {
      mockFiveMinuteHandler,
      mockSlowQueryHandler,
      mockApplyMigrationHandler,
      mockDropMigrationHandler,
    },
  };
});

// Mock forge-sql-orm
vi.mock("forge-sql-orm", () => {
  const mockFetchSchemaWebTrigger = vi.fn();
  return {
    fetchSchemaWebTrigger: mockFetchSchemaWebTrigger,
    __mocks: {
      mockFetchSchemaWebTrigger,
    },
  };
});

// Mock services
vi.mock("../../src/services", () => {
  const mockRovoService = {
    runSecurityNotesQuery: vi.fn(),
  };
  const mockAsyncService = {
    catchDegradation: vi.fn(),
  };

  return {
    RovoService: vi.fn(() => mockRovoService),
    AsyncService: vi.fn(() => mockAsyncService),
    __mocks: {
      mockRovoService,
      mockAsyncService,
    },
  };
});

// Mock cryptoUtils
vi.mock("../../src/core/utils/cryptoUtils", () => {
  const mockDecodeJwtPayload = vi.fn();
  return {
    decodeJwtPayload: mockDecodeJwtPayload,
    __mocks: {
      mockDecodeJwtPayload,
    },
  };
});

describe("index handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("handlerIssue, handlerGlobal, handlerAdmin", () => {
    it("should export handlerIssue with resolver definitions", () => {
      expect(handlerIssue).toBeDefined();
      expect(typeof handlerIssue).toBe("object");
    });

    it("should export handlerGlobal with resolver definitions", () => {
      expect(handlerGlobal).toBeDefined();
      expect(typeof handlerGlobal).toBe("object");
    });

    it("should export handlerAdmin with resolver definitions", () => {
      expect(handlerAdmin).toBeDefined();
      expect(typeof handlerAdmin).toBe("object");
    });
  });

  describe("handlerFiveMinute", () => {
    it("should call FiveMinuteTrigger.handler with request", async () => {
      const mockRequest: SchedulerTriggerRequest = {
        context: {
          cloudId: "test-cloud-id",
          moduleKey: "test-module-key",
        },
        userAccess: {
          enabled: true,
        },
        contextToken: "test-token",
      };
      const mockResponse = { statusCode: 200, body: "OK" };
      vi.mocked(controllers.FiveMinutesTrigger.handler).mockResolvedValue(mockResponse);

      const result = await handlerFiveMinute(mockRequest);

      expect(controllers.FiveMinutesTrigger.handler).toHaveBeenCalledTimes(1);
      expect(controllers.FiveMinutesTrigger.handler).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("runSlowQuery", () => {
    it("should call SlowQueryTriggerTrigger.handler", async () => {
      const mockResponse = { statusCode: 200 };
      vi.mocked(controllers.SlowQueryTriggerTrigger.handler).mockResolvedValue(mockResponse);

      const result = await runSlowQuery();

      expect(controllers.SlowQueryTriggerTrigger.handler).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("handlerMigration", () => {
    it("should call ApplySchemaMigrationTrigger.handler", async () => {
      const mockResponse = { statusCode: 200 };
      vi.mocked(controllers.ApplySchemaMigrationTrigger.handler).mockResolvedValue(mockResponse);

      const result = await handlerMigration();

      expect(controllers.ApplySchemaMigrationTrigger.handler).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("dropMigrations", () => {
    it("should call DropSchemaMigrationTrigger.handler", async () => {
      const mockResponse = { statusCode: 200 };
      vi.mocked(controllers.DropSchemaMigrationTrigger.handler).mockResolvedValue(mockResponse);

      const result = await dropMigrations();

      expect(controllers.DropSchemaMigrationTrigger.handler).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchMigrations", () => {
    it("should call fetchSchemaWebTrigger", async () => {
      const mockResponse = { schema: "test" };
      vi.mocked(forgeSqlOrm.fetchSchemaWebTrigger).mockResolvedValue(mockResponse);

      const result = await fetchMigrations();

      expect(forgeSqlOrm.fetchSchemaWebTrigger).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("runSecurityNotesQuery", () => {
    it("should call RovoService.runSecurityNotesQuery with event and context", async () => {
      const mockEvent = {
        sql: "SELECT * FROM security_notes",
        context: { jira: { issueKey: "TEST-1" } },
        contextToken: "test-token",
      };
      const mockContext = { principal: { accountId: "test-account-id" } };
      const mockResult = { rows: [], metadata: {} };

      const mockRovoServiceInstance = {
        runSecurityNotesQuery: vi.fn().mockResolvedValue(mockResult),
      };
      const originalGet = Container.prototype.get;
      vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
        if (serviceIdentifier === FORGE_INJECTION_TOKENS.RovoServiceImpl) {
          return mockRovoServiceInstance as any;
        }
        return {} as any;
      });

      const result = await runSecurityNotesQuery(mockEvent, mockContext);

      expect(mockRovoServiceInstance.runSecurityNotesQuery).toHaveBeenCalledTimes(1);
      expect(mockRovoServiceInstance.runSecurityNotesQuery).toHaveBeenCalledWith(
        mockEvent,
        mockContext,
      );

      Container.prototype.get = originalGet;
      expect(result).toEqual(mockResult);
    });

    it("should decode contextToken when context is not provided", async () => {
      const mockEvent = {
        sql: "SELECT * FROM security_notes",
        context: { jira: { issueKey: "TEST-1" } },
        contextToken: "test-token",
      };
      const decodedContext = { principal: { accountId: "decoded-account-id" } };
      vi.mocked(cryptoUtils.decodeJwtPayload).mockReturnValue(decodedContext);
      const mockResult = { rows: [], metadata: {} };

      const mockRovoServiceInstance = {
        runSecurityNotesQuery: vi.fn().mockResolvedValue(mockResult),
      };
      const originalGet = Container.prototype.get;
      vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
        if (serviceIdentifier === FORGE_INJECTION_TOKENS.RovoServiceImpl) {
          return mockRovoServiceInstance as any;
        }
        return {} as any;
      });

      const result = await runSecurityNotesQuery(mockEvent, undefined);

      expect(cryptoUtils.decodeJwtPayload).toHaveBeenCalledWith("test-token");
      expect(mockRovoServiceInstance.runSecurityNotesQuery).toHaveBeenCalledWith(
        mockEvent,
        decodedContext,
      );

      Container.prototype.get = originalGet;
      expect(result).toEqual(mockResult);
    });

    it("should create container with RovoService and JiraUserService", async () => {
      const bindSpy = vi.spyOn(Container.prototype, "bind");
      const mockEvent = {
        sql: "SELECT * FROM security_notes",
        context: { jira: { issueKey: "TEST-1" } },
        contextToken: "test-token",
      };
      const mockContext = { principal: { accountId: "test-account-id" } };
      const mockResult = { rows: [], metadata: {} };

      const mockRovoServiceInstance = {
        runSecurityNotesQuery: vi.fn().mockResolvedValue(mockResult),
      };
      const originalGet = Container.prototype.get;
      vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
        if (serviceIdentifier === FORGE_INJECTION_TOKENS.RovoServiceImpl) {
          return mockRovoServiceInstance as any;
        }
        return {} as any;
      });

      await runSecurityNotesQuery(mockEvent, mockContext);

      Container.prototype.get = originalGet;

      // Verify that container was created and bindings were set up
      expect(bindSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("handlerAsyncDegradation", () => {
    it("should call AsyncService.catchDegradation with event", async () => {
      const mockEvent: AsyncEvent = {
        cloudId: "test-cloud-id",
        eventType: "test-event",
        payload: {},
      } as AsyncEvent;
      const mockResult = { success: true };

      const mockAsyncServiceInstance = {
        catchDegradation: vi.fn().mockResolvedValue(mockResult),
      };
      const originalGet = Container.prototype.get;
      vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
        if (serviceIdentifier === FORGE_INJECTION_TOKENS.AsyncService) {
          return mockAsyncServiceInstance as any;
        }
        return {} as any;
      });

      const result = await handlerAsyncDegradation(mockEvent);

      expect(mockAsyncServiceInstance.catchDegradation).toHaveBeenCalledTimes(1);
      expect(mockAsyncServiceInstance.catchDegradation).toHaveBeenCalledWith(mockEvent);

      Container.prototype.get = originalGet;
      expect(result).toEqual(mockResult);
    });

    it("should create container with AsyncService and JiraUserService", async () => {
      const bindSpy = vi.spyOn(Container.prototype, "bind");
      const mockEvent: AsyncEvent = {
        cloudId: "test-cloud-id",
        eventType: "test-event",
        payload: {},
      } as AsyncEvent;
      const mockResult = { success: true };

      const mockAsyncServiceInstance = {
        catchDegradation: vi.fn().mockResolvedValue(mockResult),
      };
      const originalGet = Container.prototype.get;
      vi.spyOn(Container.prototype, "get").mockImplementation((serviceIdentifier: any) => {
        if (serviceIdentifier === FORGE_INJECTION_TOKENS.AsyncService) {
          return mockAsyncServiceInstance as any;
        }
        return {} as any;
      });

      await handlerAsyncDegradation(mockEvent);

      Container.prototype.get = originalGet;

      // Verify that container was created and bindings were set up
      expect(bindSpy).toHaveBeenCalledTimes(2);
    });
  });
});
