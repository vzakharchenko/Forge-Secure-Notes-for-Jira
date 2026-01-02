import { beforeEach, describe, expect, it, vi } from "vitest";
import { SecurityNoteRepository, securityNotes } from "../../../src/database";
import * as DbUtils from "../../../src/database/DbUtils";

// Create chainable mock builders
const createChainableMock = (finalResult: any) => {
  return {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue(finalResult),
    groupBy: vi.fn().mockReturnThis(),
  };
};

vi.mock("../../../src/database/DbUtils", () => {
  const mockSelectCacheable = vi.fn();
  const mockSelect = vi.fn();
  const mockSelectFrom = vi.fn();
  const mockModifyWithVersioningAndEvictCache = vi.fn();
  const mockExecuteCacheable = vi.fn();

  return {
    FORGE_SQL_ORM: {
      selectCacheable: mockSelectCacheable,
      select: mockSelect,
      selectFrom: mockSelectFrom,
      modifyWithVersioningAndEvictCache: mockModifyWithVersioningAndEvictCache,
      executeCacheable: mockExecuteCacheable,
    },
    __mocks: {
      mockSelectCacheable,
      mockSelect,
      mockSelectFrom,
      mockModifyWithVersioningAndEvictCache,
      mockExecuteCacheable,
    },
  };
});

// Mock withAppContext decorator
vi.mock("../../../src/controllers", () => ({
  withAppContext: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    return descriptor;
  },
}));

describe("SecurityNoteRepository", () => {
  let repository: SecurityNoteRepository;
  let mockSelectCacheable: ReturnType<typeof vi.fn>;
  let mockSelect: ReturnType<typeof vi.fn>;
  let mockSelectFrom: ReturnType<typeof vi.fn>;
  let mockModifyWithVersioningAndEvictCache: ReturnType<typeof vi.fn>;
  let mockExecuteCacheable: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    repository = new SecurityNoteRepository();
    // Get mocks from the mocked module
    mockSelectCacheable = vi.mocked(DbUtils.FORGE_SQL_ORM.selectCacheable);
    mockSelect = vi.mocked(DbUtils.FORGE_SQL_ORM.select);
    mockSelectFrom = vi.mocked(DbUtils.FORGE_SQL_ORM.selectFrom);
    mockModifyWithVersioningAndEvictCache = vi.mocked(
      DbUtils.FORGE_SQL_ORM.modifyWithVersioningAndEvictCache,
    );
    mockExecuteCacheable = vi.mocked(DbUtils.FORGE_SQL_ORM.executeCacheable);
    vi.clearAllMocks();
  });

  describe("getAllSecurityNotesByIssue", () => {
    it("should return security notes by issue without accountId filter", async () => {
      const mockResult = [{ id: "1", issueKey: "TEST-1", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllSecurityNotesByIssue("TEST-1", 10, 0, null);

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it("should return security notes by issue with accountId filter", async () => {
      const mockResult = [{ id: "1", issueKey: "TEST-1", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllSecurityNotesByIssue("TEST-1", 10, 0, "user-123");

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it("should handle both issueId and issueKey matching", async () => {
      const mockResult = [{ id: "1", issueKey: "TEST-1", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      await repository.getAllSecurityNotesByIssue("TEST-1", 10, 0, null);

      expect(mockSelectCacheable).toHaveBeenCalled();
    });
  });

  describe("getAllSecurityNotesByProject", () => {
    it("should return security notes by project without accountId filter", async () => {
      const mockResult = [{ id: "1", projectKey: "PROJ", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllSecurityNotesByProject("PROJ", 10, 0, null);

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it("should return security notes by project with accountId filter", async () => {
      const mockResult = [{ id: "1", projectKey: "PROJ", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllSecurityNotesByProject("PROJ", 10, 0, "user-123");

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("getIssuesAndProjects", () => {
    it("should return issues and projects", async () => {
      const mockResult = [
        { issueId: "1", issueKey: "TEST-1", projectId: "PROJ-1", projectKey: "PROJ" },
      ];
      const chain = createChainableMock(mockResult);
      // groupBy doesn't have limit, so we need to make it return the result
      chain.groupBy = vi.fn().mockResolvedValue(mockResult);
      mockSelectCacheable.mockReturnValue(chain);

      const result = await repository.getIssuesAndProjects();

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("getAllSecurityNotesByAccountId", () => {
    it("should return security notes by accountId", async () => {
      const mockResult = [{ id: "1", createdBy: "user-123", count: 1 }];
      mockSelectCacheable.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllSecurityNotesByAccountId("user-123", 10, 0);

      expect(mockSelectCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("viewSecurityNote", () => {
    it("should update security note status to VIEWED", async () => {
      const mockUpdateById = vi.fn().mockResolvedValue(undefined);
      mockModifyWithVersioningAndEvictCache.mockReturnValue({
        updateById: mockUpdateById,
      });

      await repository.viewSecurityNote("note-id-123");

      expect(mockModifyWithVersioningAndEvictCache).toHaveBeenCalled();
      expect(mockUpdateById).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "VIEWED",
          id: "note-id-123",
        }),
        securityNotes,
      );
    });
  });

  describe("createSecurityNote", () => {
    it("should create security notes", async () => {
      const mockInsert = vi.fn().mockResolvedValue(undefined);
      mockModifyWithVersioningAndEvictCache.mockReturnValue({
        insert: mockInsert,
      });

      const mockData = [
        {
          targetUserId: "user-123",
          targetUserName: "Test User",
          expiry: "1 day",
          isCustomExpiry: 0,
          encryptionKeyHash: "hash",
          iv: "iv",
          salt: "salt",
          createdBy: "creator-123",
          status: "NEW",
          expiryDate: new Date(),
          targetAvatarUrl: "url",
          createdUserName: "Creator",
          createdAvatarUrl: "url",
        },
      ];

      await repository.createSecurityNote(mockData);

      expect(mockModifyWithVersioningAndEvictCache).toHaveBeenCalled();
      expect(mockInsert).toHaveBeenCalledWith(securityNotes, expect.any(Array));
    });
  });

  describe("getAllMySecurityNotes", () => {
    it("should return my security notes for an issue", async () => {
      const mockResult = [{ id: "1", issueKey: "TEST-1", count: 1 }];
      const chain = createChainableMock(mockResult);
      // orderBy is the last call, so it should return the result
      chain.orderBy = vi.fn().mockResolvedValue(mockResult);
      mockSelect.mockReturnValue(chain);

      const result = await repository.getAllMySecurityNotes("TEST-1", "user-123");

      expect(mockSelect).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("getAllExpiredNotes", () => {
    it("should return expired notes", async () => {
      const mockResult = [{ id: "1", status: "NEW", count: 1 }];
      mockSelect.mockReturnValue(createChainableMock(mockResult));

      const result = await repository.getAllExpiredNotes();

      expect(mockSelect).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("deleteSecurityNote", () => {
    it("should delete security note", async () => {
      const mockUpdateById = vi.fn().mockResolvedValue(undefined);
      mockModifyWithVersioningAndEvictCache.mockReturnValue({
        updateById: mockUpdateById,
      });

      await repository.deleteSecurityNote("note-id-123");

      expect(mockModifyWithVersioningAndEvictCache).toHaveBeenCalled();
      expect(mockUpdateById).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "DELETED",
          id: "note-id-123",
        }),
        securityNotes,
      );
    });
  });

  describe("expireSecurityNote", () => {
    it("should expire security notes", async () => {
      const mockUpdateFields = vi.fn().mockResolvedValue(undefined);
      mockModifyWithVersioningAndEvictCache.mockReturnValue({
        updateFields: mockUpdateFields,
      });

      await repository.expireSecurityNote(["note-id-1", "note-id-2"]);

      expect(mockModifyWithVersioningAndEvictCache).toHaveBeenCalled();
      expect(mockUpdateFields).toHaveBeenCalled();
    });
  });

  describe("getSecurityNode", () => {
    it("should return security note when found", async () => {
      const mockResult = [{ id: "note-id-123", status: "NEW" }];
      // selectFrom returns an object with where method that returns a promise
      const mockWhere = vi.fn().mockResolvedValue(mockResult);
      mockSelectFrom.mockReturnValue({
        where: mockWhere,
      });

      const result = await repository.getSecurityNode("note-id-123");

      expect(mockSelectFrom).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toEqual(mockResult[0]);
    });

    it("should return undefined when not found", async () => {
      const mockWhere = vi.fn().mockResolvedValue([]);
      mockSelectFrom.mockReturnValue({
        where: mockWhere,
      });

      const result = await repository.getSecurityNode("non-existent-id");

      expect(mockSelectFrom).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe("getSecurityNoteUsers", () => {
    it("should return security note users", async () => {
      const mockResult = [
        [
          {
            accountId: "user-123",
            displayName: "Test User",
            avatarUrl: "url",
          },
        ],
      ];
      mockExecuteCacheable.mockResolvedValue(mockResult);

      const result = await repository.getSecurityNoteUsers();

      expect(mockExecuteCacheable).toHaveBeenCalled();
      expect(result).toEqual(mockResult[0]);
    });

    it("should return empty array when no users found", async () => {
      mockExecuteCacheable.mockResolvedValue(null);

      const result = await repository.getSecurityNoteUsers();

      expect(mockExecuteCacheable).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return empty array when result is empty", async () => {
      mockExecuteCacheable.mockResolvedValue([]);

      const result = await repository.getSecurityNoteUsers();

      expect(mockExecuteCacheable).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
