import { describe, it, expect, vi, beforeEach } from "vitest";
import { IssueAuditController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { IssueIdWithPagination } from "../../../../shared/dto";

describe("IssueAuditController", () => {
  let controller: IssueAuditController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getSecurityNoteByIssue: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new IssueAuditController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.AUDIT_DATA_PER_ISSUE);
    });
  });

  describe("response", () => {
    it("should call getSecurityNoteByIssue with correct parameters and return result", async () => {
      const mockRequest: Request<IssueIdWithPagination> = {
        payload: {
          issueId: "TEST-1",
          limit: 10,
          offset: 0,
        } as IssueIdWithPagination,
      } as Request<IssueIdWithPagination>;
      const mockNotes = [
        {
          id: "1",
          issueKey: "TEST-1",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getSecurityNoteByIssue).mockResolvedValue(mockNotes as any);

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getSecurityNoteByIssue).toHaveBeenCalledWith("TEST-1", 10, 0);
    });
  });
});
