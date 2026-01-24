import { describe, it, expect, vi, beforeEach } from "vitest";
import { SecurityNoteService } from "../../../src/services";
import { SecurityNoteRepository } from "../../../src/database";
import { JiraUserService } from "../../../src/jira";
import { BootstrapService } from "../../../src/services";
import { SecurityStorage } from "../../../src/storage";
import { getAppContext } from "../../../src/controllers";
import * as coreUtils from "../../../src/core";
import { publishGlobal } from "@forge/realtime";

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
  calculateSaltHash: vi.fn(),
  verifyHashConstantTime: vi.fn(),
  sendExpirationNotification: vi.fn(),
  sendIssueNotification: vi.fn(),
  sendNoteDeletedNotification: vi.fn(),
  isIssueContext: vi.fn(),
}));

vi.mock("@forge/realtime", () => ({
  publishGlobal: vi.fn(),
}));

const mockV4 = vi.fn();
vi.mock("uuid", () => ({
  v4: () => mockV4(),
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

    it("should return empty array when no notes found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByIssue).mockResolvedValue([]);

      const result = await service.getSecurityNoteByIssue("TEST-1", 10, 0);

      expect(result).toEqual([]);
    });
  });

  describe("getSecurityNoteByProject", () => {
    it("should return security notes for project when user is admin", async () => {
      const mockContext = {
        accountId: "admin-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(true);
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
      expect(mockSecurityNoteRepository.getAllSecurityNotesByProject).toHaveBeenCalledWith(
        "PROJ",
        10,
        0,
        null, // admin gets null accountId filter
      );
    });

    it("should return security notes for project when user is not admin", async () => {
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
      expect(mockSecurityNoteRepository.getAllSecurityNotesByProject).toHaveBeenCalledWith(
        "PROJ",
        10,
        0,
        "user-123", // non-admin gets accountId filter
      );
    });

    it("should return empty array when no notes found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByProject).mockResolvedValue([]);

      const result = await service.getSecurityNoteByProject("PROJ", 10, 0);

      expect(result).toEqual([]);
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

    it("should return security notes when user is not admin but accountId matches", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
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

    it("should return empty array when no notes found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockBootstrapService.isAdmin).mockResolvedValue(false);
      vi.mocked(mockSecurityNoteRepository.getAllSecurityNotesByAccountId).mockResolvedValue([]);

      const result = await service.getSecurityNoteByAccountId("user-123", 10, 0);

      expect(result).toEqual([]);
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

    it("should expire multiple notes", async () => {
      const mockNotes = [
        {
          id: "note-1",
          issueKey: "TEST-1",
          targetUserId: "user-123",
          createdUserName: "Creator",
        },
        {
          id: "note-2",
          issueKey: "TEST-2",
          targetUserId: "user-456",
          createdUserName: "Creator2",
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllExpiredNotes).mockResolvedValue(mockNotes as any);
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendExpirationNotification).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.expireSecurityNote).mockResolvedValue(undefined);

      await service.expireSecurityNotes();

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-2");
      expect(coreUtils.sendExpirationNotification).toHaveBeenCalledTimes(2);
      expect(mockSecurityNoteRepository.expireSecurityNote).toHaveBeenCalledWith([
        "note-1",
        "note-2",
      ]);
    });

    it("should handle error when sending notification fails", async () => {
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
      vi.mocked(coreUtils.sendExpirationNotification).mockRejectedValue(
        new Error("Notification failed"),
      );
      vi.mocked(mockSecurityNoteRepository.expireSecurityNote).mockResolvedValue(undefined);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await service.expireSecurityNotes();

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityNoteRepository.expireSecurityNote).toHaveBeenCalledWith(["note-1"]);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should not send notification when issueKey is missing", async () => {
      const mockNotes = [
        {
          id: "note-1",
          issueKey: null,
          targetUserId: "user-123",
          createdUserName: "Creator",
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllExpiredNotes).mockResolvedValue(mockNotes as any);
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.expireSecurityNote).mockResolvedValue(undefined);

      await service.expireSecurityNotes();

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(coreUtils.sendExpirationNotification).not.toHaveBeenCalled();
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
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        targetUserId: "user-123",
        createdBy: "user-123",
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

    it("should not delete when note not found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(undefined);

      await service.deleteSecurityNote("non-existent");

      expect(mockSecurityStorage.deletePayload).not.toHaveBeenCalled();
      expect(mockSecurityNoteRepository.deleteSecurityNote).not.toHaveBeenCalled();
    });

    it("should not delete when user is not the creator", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        targetUserId: "user-456",
        createdBy: "other-user",
        createdUserName: "Creator",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);

      await service.deleteSecurityNote("note-1");

      expect(mockSecurityStorage.deletePayload).not.toHaveBeenCalled();
      expect(mockSecurityNoteRepository.deleteSecurityNote).not.toHaveBeenCalled();
    });

    it("should handle error when sending notification fails", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        targetUserId: "user-123",
        createdBy: "user-123",
        createdUserName: "Creator",
      };
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(mockSecurityNoteRepository.deleteSecurityNote).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendNoteDeletedNotification).mockRejectedValue(
        new Error("Notification failed"),
      );
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await service.deleteSecurityNote("note-1");

      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityNoteRepository.deleteSecurityNote).toHaveBeenCalledWith("note-1");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("createSecurityNote", () => {
    it("should create security note with current user info", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockCurrentUser = {
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      };
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue(mockCurrentUser as any);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue({
        displayName: "Target User",
        avatarUrls: { "32x32": "target-avatar" },
      } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValue("note-id-123");

      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      expect(mockSecurityStorage.savePayload).toHaveBeenCalledWith("note-id-123", "encrypted-data");
      expect(coreUtils.sendIssueNotification).toHaveBeenCalled();
    });

    it("should create security note without current user info", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue(undefined);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue(undefined);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValue("note-id-123");

      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      const createCall = vi.mocked(mockSecurityNoteRepository.createSecurityNote).mock
        .calls[0][0][0];
      expect(createCall.createdUserName).toBe("user-123");
      expect(createCall.createdAvatarUrl).toBe("");
      expect(createCall.targetAvatarUrl).toBe("");
    });

    it("should handle custom expiry date", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue({
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      } as any);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue({
        displayName: "Target User",
        avatarUrls: { "32x32": "target-avatar" },
      } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValue("note-id-123");

      const customExpiryDate = new Date("2024-12-31");
      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: true,
        expiry: customExpiryDate.toISOString(),
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      const createCall = vi.mocked(mockSecurityNoteRepository.createSecurityNote).mock
        .calls[0][0][0];
      expect(createCall.isCustomExpiry).toBe(1);
      expect(new Date(createCall.expiryDate as Date).getTime()).toBe(customExpiryDate.getTime());
    });

    it("should handle error when sending notification fails", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue({
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      } as any);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue({
        displayName: "Target User",
        avatarUrls: { "32x32": "target-avatar" },
      } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockRejectedValue(
        new Error("Notification failed"),
      );
      mockV4.mockReturnValue("note-id-123");
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should create security note for multiple target users", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue({
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      } as any);
      vi.mocked(mockJiraUserService.getUserById)
        .mockResolvedValueOnce({
          displayName: "Target User 1",
          avatarUrls: { "32x32": "target-avatar-1" },
        } as any)
        .mockResolvedValueOnce({
          displayName: "Target User 2",
          avatarUrls: { "32x32": "target-avatar-2" },
        } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValueOnce("note-id-1").mockReturnValueOnce("note-id-2");

      const securityNote = {
        targetUsers: [
          { accountId: "target-123", userName: "Target User 1" },
          { accountId: "target-456", userName: "Target User 2" },
        ],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      const createCall = vi.mocked(mockSecurityNoteRepository.createSecurityNote).mock.calls[0][0];
      expect(createCall.length).toBe(2);
      expect(mockSecurityStorage.savePayload).toHaveBeenCalledTimes(2);
      expect(coreUtils.sendIssueNotification).toHaveBeenCalledTimes(2);
    });

    it("should build note link with customerRequest when available", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
          customerRequest: {
            _links: {
              web: "https://example.atlassian.net/servicedesk/customer/portal/1/TEST-1",
            },
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue({
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      } as any);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue({
        displayName: "Target User",
        avatarUrls: { "32x32": "target-avatar" },
      } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValue("note-id-123");

      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(coreUtils.sendIssueNotification).toHaveBeenCalled();
      const notificationCall = vi.mocked(coreUtils.sendIssueNotification).mock.calls[0][0];
      expect(notificationCall.noteLink).toBe(
        "https://example.atlassian.net/servicedesk/customer/portal/1/TEST-1",
      );
    });

    it("should handle missing project in context", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: undefined,
          },
          localId: "ari:cloud:ecosystem::app/abc123/def456",
          siteUrl: "https://example.atlassian.net",
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockJiraUserService.getCurrentUser).mockResolvedValue({
        displayName: "Test User",
        avatarUrls: { "32x32": "avatar-url" },
      } as any);
      vi.mocked(mockJiraUserService.getUserById).mockResolvedValue({
        displayName: "Target User",
        avatarUrls: { "32x32": "target-avatar" },
      } as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(mockSecurityNoteRepository.createSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityStorage.savePayload).mockResolvedValue(undefined);
      vi.mocked(coreUtils.sendIssueNotification).mockResolvedValue(undefined);
      mockV4.mockReturnValue("note-id-123");

      const securityNote = {
        targetUsers: [{ accountId: "target-123", userName: "Target User" }],
        encryptionKeyHash: "key-hash",
        iv: "iv-value",
        salt: "salt-value",
        isCustomExpiry: false,
        expiry: "1h",
        description: "Test note",
        encryptedPayload: "encrypted-data",
      };

      await service.createSecurityNote(securityNote as any);

      expect(mockSecurityNoteRepository.createSecurityNote).toHaveBeenCalled();
      const createCall = vi.mocked(mockSecurityNoteRepository.createSecurityNote).mock.calls[0][0];
      expect(createCall[0].projectId).toBeUndefined();
      expect(createCall[0].projectKey).toBeUndefined();
    });
  });

  describe("getSecuredData", () => {
    it("should return security note data when valid", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        issueId: "issue-123",
        targetUserId: "user-123",
        createdBy: "creator-123",
        createdUserName: "Creator",
        encryptionKeyHash: "hash-value",
        iv: "iv-value",
        salt: "salt-value",
        expiry: "1h",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(coreUtils.verifyHashConstantTime).mockImplementation(() => {});
      vi.mocked(mockSecurityStorage.getPayload).mockResolvedValue("encrypted-data");
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.viewSecurityNote).mockResolvedValue(undefined);
      vi.mocked(publishGlobal).mockResolvedValue(undefined);

      const result = await service.getSecuredData("note-1", "key");

      expect(result).toBeDefined();
      expect(result?.id).toBe("note-1");
      expect(result?.iv).toBe("iv-value");
      expect(result?.salt).toBe("salt-value");
      expect(result?.encryptedData).toBe("encrypted-data");
      expect(result?.viewTimeOut).toBe(300);
      expect(coreUtils.calculateSaltHash).toHaveBeenCalledWith("key", "user-123");
      expect(coreUtils.verifyHashConstantTime).toHaveBeenCalled();
      expect(mockSecurityStorage.getPayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityStorage.deletePayload).toHaveBeenCalledWith("note-1");
      expect(mockSecurityNoteRepository.viewSecurityNote).toHaveBeenCalledWith("note-1");
      expect(publishGlobal).toHaveBeenCalled();
    });

    it("should return undefined when note not found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(undefined);

      const result = await service.getSecuredData("non-existent", "key");

      expect(result).toBeUndefined();
    });

    it("should return undefined when accountId does not match", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "other-user",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);

      const result = await service.getSecuredData("note-1", "key");

      expect(result).toBeUndefined();
    });

    it("should return undefined and delete note when encrypted data not found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "user-123",
        encryptionKeyHash: "hash-value",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(coreUtils.verifyHashConstantTime).mockImplementation(() => {});
      vi.mocked(mockSecurityStorage.getPayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.deleteSecurityNote).mockResolvedValue(undefined);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await service.getSecuredData("note-1", "key");

      expect(result).toBeUndefined();
      expect(mockSecurityNoteRepository.deleteSecurityNote).toHaveBeenCalledWith("note-1");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("should throw error when hash verification fails", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "user-123",
        encryptionKeyHash: "hash-value",
        createdUserName: "Creator",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("wrong-hash");
      vi.mocked(coreUtils.verifyHashConstantTime).mockImplementation(() => {
        throw new Error("SecurityKey is not valid");
      });

      await expect(service.getSecuredData("note-1", "wrong-key")).rejects.toThrow();
    });

    it("should handle null issueId when publishing global event", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        issueKey: "TEST-1",
        issueId: null,
        targetUserId: "user-123",
        createdBy: "creator-123",
        createdUserName: "Creator",
        encryptionKeyHash: "hash-value",
        iv: "iv-value",
        salt: "salt-value",
        expiry: "1h",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("hash-value");
      vi.mocked(coreUtils.verifyHashConstantTime).mockImplementation(() => {});
      vi.mocked(mockSecurityStorage.getPayload).mockResolvedValue("encrypted-data");
      vi.mocked(mockSecurityStorage.deletePayload).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteRepository.viewSecurityNote).mockResolvedValue(undefined);
      vi.mocked(publishGlobal).mockResolvedValue(undefined);

      const result = await service.getSecuredData("note-1", "key");

      expect(result).toBeDefined();
      expect(publishGlobal).toHaveBeenCalledWith(expect.any(String), "");
    });
  });

  describe("isValidLink", () => {
    it("should return valid true when accountId matches", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "user-123",
        createdBy: "creator-123",
        description: "test description",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("source-hash");

      const result = await service.isValidLink("note-1");

      expect(result.valid).toBe(true);
      expect(result.sourceAccountId).toBe("source-hash");
      expect(coreUtils.calculateSaltHash).toHaveBeenCalledWith("test description", "creator-123");
    });

    it("should return valid false when accountId does not match", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "other-user",
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);

      const result = await service.isValidLink("note-1");

      expect(result.valid).toBe(false);
      expect(result.sourceAccountId).toBeUndefined();
    });

    it("should return valid false when note not found", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(undefined);

      const result = await service.isValidLink("non-existent");

      expect(result.valid).toBe(false);
    });

    it("should return valid false when accountId is missing", async () => {
      vi.mocked(getAppContext).mockReturnValue(null);

      const result = await service.isValidLink("note-1");

      expect(result.valid).toBe(false);
    });

    it("should use createdBy when description is missing", async () => {
      const mockContext = {
        accountId: "user-123",
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      const mockNote = {
        id: "note-1",
        targetUserId: "user-123",
        createdBy: "creator-123",
        description: null,
      };
      vi.mocked(mockSecurityNoteRepository.getSecurityNode).mockResolvedValue(mockNote as any);
      vi.mocked(coreUtils.calculateSaltHash).mockResolvedValue("source-hash");

      const result = await service.isValidLink("note-1");

      expect(result.valid).toBe(true);
      expect(coreUtils.calculateSaltHash).toHaveBeenCalledWith("creator-123", "creator-123");
    });
  });

  describe("getMySecurityNoteIssue", () => {
    it("should return security notes for current issue", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(coreUtils.isIssueContext).mockReturnValue(true);
      const mockNotes = [
        {
          id: "note-1",
          createdBy: "user-123",
          createdUserName: "User",
          createdAvatarUrl: "avatar",
          targetUserId: "target-123",
          targetUserName: "Target",
          targetAvatarUrl: "target-avatar",
          status: "NEW",
          expiryDate: new Date(),
          createdAt: new Date(),
          expiry: "1h",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllMySecurityNotes).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getMySecurityNoteIssue();

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].issueId).toBe("issue-123");
      expect(result[0].issueKey).toBe("TEST-1");
      expect(result[0].projectId).toBe("project-123");
      expect(result[0].projectKey).toBe("PROJ");
      expect(mockSecurityNoteRepository.getAllMySecurityNotes).toHaveBeenCalledWith(
        "TEST-1",
        "user-123",
      );
    });

    it("should throw error when context is not IssueContext", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {},
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(coreUtils.isIssueContext).mockReturnValue(false);

      await expect(service.getMySecurityNoteIssue()).rejects.toThrow("expected Issue context");
    });

    it("should return empty array when no notes found", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: { id: "project-123", key: "PROJ" },
          },
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(coreUtils.isIssueContext).mockReturnValue(true);
      vi.mocked(mockSecurityNoteRepository.getAllMySecurityNotes).mockResolvedValue([]);

      const result = await service.getMySecurityNoteIssue();

      expect(result).toEqual([]);
    });

    it("should handle missing project in context", async () => {
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            issue: { key: "TEST-1", id: "issue-123" },
            project: undefined,
          },
        },
      };
      vi.mocked(getAppContext).mockReturnValue(mockContext as any);
      vi.mocked(coreUtils.isIssueContext).mockReturnValue(true);
      const mockNotes = [
        {
          id: "note-1",
          createdBy: "user-123",
          createdUserName: "User",
          createdAvatarUrl: "avatar",
          targetUserId: "target-123",
          targetUserName: "Target",
          targetAvatarUrl: "target-avatar",
          status: "NEW",
          expiryDate: new Date(),
          createdAt: new Date(),
          expiry: "1h",
          count: 1,
        },
      ];
      vi.mocked(mockSecurityNoteRepository.getAllMySecurityNotes).mockResolvedValue(
        mockNotes as any,
      );

      const result = await service.getMySecurityNoteIssue();

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0].projectId).toBeUndefined();
      expect(result[0].projectKey).toBeUndefined();
    });
  });
});
