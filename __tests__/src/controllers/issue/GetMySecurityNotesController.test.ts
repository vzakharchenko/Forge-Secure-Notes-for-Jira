import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetMySecurityNotesController } from "../../../../src/controllers";
import { KVSSchemaMigrationService, SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";

describe("GetMySecurityNotesController", () => {
  let controller: GetMySecurityNotesController;
  let mockKvsSchemaMigrationService: KVSSchemaMigrationService;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockKvsSchemaMigrationService = {
      isLatestVersion: vi.fn(),
      setLatestVersion: vi.fn(),
      clearVersion: vi.fn(),
    } as unknown as KVSSchemaMigrationService;
    mockSecurityNoteService = {
      getMySecurityNoteIssue: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new GetMySecurityNotesController(
      mockKvsSchemaMigrationService,
      mockSecurityNoteService,
    );
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.GET_MY_SECURED_NOTES);
    });
  });

  describe("response", () => {
    it("should call getMySecurityNoteIssue and return result", async () => {
      const mockNotes = [
        {
          id: "1",
          issueKey: "TEST-1",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getMySecurityNoteIssue).mockResolvedValue(mockNotes as any);

      const result = await controller.response();

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getMySecurityNoteIssue).toHaveBeenCalledTimes(1);
    });
  });
});
