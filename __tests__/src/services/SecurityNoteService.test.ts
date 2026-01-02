import { describe, it, expect, vi, beforeEach } from "vitest";
import { SecurityNoteService } from "../../../src/services";
import { SecurityNoteRepository } from "../../../src/database";
import { JiraUserService } from "../../../src/jira";
import { BootstrapService } from "../../../src/services";
import { SecurityStorage } from "../../../src/storage";
import { getAppContext } from "../../../src/controllers";
import * as coreUtils from "../../../src/core";

// Mock dependencies
vi.mock("../../../src/database", () => ({
  SecurityNoteRepository: vi.fn(),
}));

vi.mock("../../../src/jira/jiraUserService", () => ({
  JiraUserService: vi.fn(),
}));

vi.mock("../../../src/services/BootstrapService", () => ({
  BootstrapService: vi.fn(),
}));

vi.mock("../../../src/storage", () => ({
  SecurityStorage: vi.fn(),
}));

vi.mock("../../../src/controllers", () => ({
  getAppContext: vi.fn(),
  withAppContext: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  },
}));

vi.mock("../../../src/core", () => ({
  calculateHash: vi.fn(),
  sendExpirationNotification: vi.fn(),
  sendIssueNotification: vi.fn(),
  sendNoteDeletedNotification: vi.fn(),
  isIssueContext: vi.fn(),
}));

vi.mock("@forge/realtime", () => ({
  publishGlobal: vi.fn(),
}));

vi.mock("uuid", () => ({
  v4: vi.fn(),
}));

describe("SecurityNoteService", () => {
  let service: SecurityNoteService;
  let mockSecurityNoteRepository: SecurityNoteRepository;
  let mockJiraUserService: JiraUserService;
  let mockBootstrapService: BootstrapService;
  let mockSecurityStorage: SecurityStorage;

  beforeEach(() => {
    mockSecurityNoteRepository = {
      getAllSecurityNotesByIssue: vi.fn(),
      getAllSecurityNotesByProject: vi.fn(),
      getIssuesAndProjects: vi.fn(),
      getAllSecurityNotesByAccountId: vi.fn(),
      getSecurityNoteUsers: vi.fn(),
      getAllExpiredNotes: vi.fn(),
      expireSecurityNote: vi.fn(),
      getSecurityNode: vi.fn(),
      viewSecurityNote: vi.fn(),
      deleteSecurityNote: vi.fn(),
      getAllMySecurityNotes: vi.fn(),
      createSecurityNote: vi.fn(),
    } as unknown as SecurityNoteRepository;

    mockJiraUserService = {
      getCurrentUser: vi.fn(),
      getUserById: vi.fn(),
    } as unknown as JiraUserService;

    mockBootstrapService = {
      isAdmin: vi.fn(),
    } as unknown as BootstrapService;

    mockSecurityStorage = {
      getPayload: vi.fn(),
      savePayload: vi.fn(),
      deletePayload: vi.fn(),
    } as unknown as SecurityStorage;

    service = new SecurityNoteService(
      mockJiraUserService,
      mockSecurityNoteRepository,
      mockBootstrapService,
      mockSecurityStorage,
    );

    vi.clearAllMocks();
  });

  describe("getSecurityNoteByIssue", () => {
    it("should return security notes for issue when user is admin", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(true);
      const mockNotes = [
        {
          id: "1",
          issueKey: "TEST-1",
          createdBy: "user-123",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByIssue).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getSecurityNoteByIssue("TEST-1", 10, 0);

      expect(result).toBeDefined();
      expect(mockSecurityNoteRepository.getAllSecurityNotesByIssue).toHaveBeenCalledWith(
        "TEST-1",
        10,
        0,
        null, // admin gets null accountId filter
      );
    });

    it("should return security notes for issue when user is not admin", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
      const mockNotes = [
        {
          id: "1",
          issueKey: "TEST-1",
          createdBy: "user-123",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByIssue).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getSecurityNoteByIssue("TEST-1", 10, 0);

      expect(result).toBeDefined();
      expect(mockSecurityNoteRepository.getAllSecurityNotesByIssue).toHaveBeenCalledWith(
        "TEST-1",
        10,
        0,
        "user-123", // non-admin gets accountId filter
      );
    });
  });

  describe("getSecurityNoteByProject", () => {
    it("should return security notes for project", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
      const mockNotes = [
        {
          id: "1",
          projectKey: "PROJ",
          createdBy: "user-123",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByProject).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getSecurityNoteByProject("PROJ", 10, 0);

      expect(result).toBeDefined();
      expect(mockSecurityNoteRepository.getAllSecurityNotesByProject).toHaveBeenCalled();
    });
  });

  describe("getIssuesAndProjects", () => {
    it("should return issues and projects", async () => {
      const mockResult = [
        { issueId: "1", issueKey: "TEST-1", projectId: "PROJ-1", projectKey: "PROJ" },
      ];
      vi.mocked(mockSecurityNoteRepository.getIssuesAndProjects).mockResolvedValue(
        mockResult as any,
      );

      const result = await service.getIssuesAndProjects();

      expect(result.result).toEqual(mockResult);
      expect(mockSecurityNoteRepository.getIssuesAndProjects).toHaveBeenCalled();
    });
  });

  describe("getSecurityNoteByAccountId", () => {
    it("should return security notes for accountId when user is admin", async () => {
      const mockContext = {
        accountId: "admin-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(true);
      const mockNotes = [
        {
          id: "1",
          createdBy: "user-123",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByAccountId).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getSecurityNoteByAccountId("user-123", 10, 0);

      expect(result).toBeDefined();
      expect(mockSecurityNoteRepository.getAllSecurityNotesByAccountId).toHaveBeenCalledWith(
        "user-123",
        10,
        0,
      );
    });

    it("should return empty array when user is not admin and accountId does not match", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);

      const result = await service.getSecurityNoteByAccountId("other-user", 10, 0);

      expect(result).toEqual([]);
      expect(mockSecurityNoteRepository.getAllSecurityNotesByAccountId).not.toHaveBeenCalled();
    });
  });

  describe("getSecurityNoteUsers", () => {
    it("should return security note users", async () => {
      const mockUsers = [{ accountId: "user-123", displayName: "Test User", avatarUrl: "url" }];
      vi.mocked(mockSecurityNoteRepository.getSecurityNoteUsers).mockResolvedValue(
        mockUsers as any,
      );

      const result = await service.getSecurityNoteUsers();

      expect(result).toEqual(mockUsers);
      expect(mockSecurityNoteRepository.getSecurityNoteUsers).toHaveBeenCalled();
    });
  });

  describe("expireSecurityNotes", () => {
    it("should expire notes and send notifications", async () => {
      const mockNotes = [
        {
          id: "note-1",
          issueKey: "TEST-1",
          targetUserId: "user-123",
          createdUserName: "Creator",
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllExpiredNotes).mockResolvedValue(mockNotes as any);
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendExpirationNotification).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.expireSecurityNote).mockResolvedValue(undefined);

      await service.expireSecurityNotes();

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(coreUtils.sendExpirationNotification).toHaveBeenCalled();
      expect(mockSecurityNoteRepository.expireSecurityNote).toHaveBeenCalledWith(["note-1"]);
    });

    it("should not process when no expired notes", async () => {
      vi.mocked(mockSecurityNoteRepository.getAllExpiredNotes).mockResolvedValue([]);

      await service.expireSecurityNotes();

      expect(mockSecurityStorage.deletePayload).not.toHaveBeenCalled();
      expect(mockSecurityNoteRepository.expireSecurityNote).not.toHaveBeenCalled();
    });
  });

  describe("getExpire", () => {
    it("should return date with 1 hour added for '1h'", () => {
      const now = new Date();
      const result = service.getExpire("1h");

      expect(result.getTime()).toBeGreaterThan(now.getTime());
      const diff = result.getTime() - now.getTime();
      expect(diff).toBeCloseTo(60 * 60 * 1000, -3); // ~1 hour in ms
    });

    it("should return date with 24 hours added for '1d'", () => {
      const now = new Date();
      const result = service.getExpire("1d");

      const diff = result.getTime() - now.getTime();
      expect(diff).toBeCloseTo(24 * 60 * 60 * 1000, -3); // ~24 hours in ms
    });

    it("should return date with 7 days added for '7d'", () => {
      const now = new Date();
      const result = service.getExpire("7d");

      const diff = result.getTime() - now.getTime();
      expect(diff).toBeCloseTo(7 * 24 * 60 * 60 * 1000, -3); // ~7 days in ms
    });

    it("should return date with 10 days added for default case", () => {
      const now = new Date();
      const result = service.getExpire("unknown");

      const diff = result.getTime() - now.getTime();
      expect(diff).toBeCloseTo(10 * 24 * 60 * 60 * 1000, -3); // ~10 days in ms
    });
  });

  describe("addHours", () => {
    it("should add hours to date", () => {
      const date = new Date("2024-01-01T00:00:00Z");
      const result = service.addHours(date, 2);

      const expectedTime = date.getTime() + 2 * 60 * 60 * 1000;
      expect(result.getTime()).toBe(expectedTime);
    });
  });

  describe("deleteSecurityNote", () => {
    it("should delete security note and send notification", async () => {
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        targetUserId: "user-123",
        createdUserName: "Creator",
      };
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(mockSecurityNoteRepository.deleteSecurityNote).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendNoteDeletedNotification).mockResolvedValue(undefined);

      await service.deleteSecurityNote("note-1");

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityNoteRepository.deleteSecurityNote).toHaveBeenCalledWith("note-1");
      expect(coreUtils.sendNoteDeletedNotification).toHaveBeenCalled();
    });

    it("should not send notification when note not found", async () => {
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(undefined);

      await service.deleteSecurityNote("non-existent");

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalled();
      expect(mockSecurityNoteRepository.deleteSecurityNote).not.toHaveBeenCalled();
    });
  });
});
