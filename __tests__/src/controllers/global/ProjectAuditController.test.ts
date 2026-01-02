import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectAuditController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { ProjectWithPagination } from "../../../../shared/dto";

describe("ProjectAuditController", () => {
  let controller: ProjectAuditController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getSecurityNoteByProject: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new ProjectAuditController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.AUDIT_DATA_PER_PROJECT);
    });
  });

  describe("response", () => {
    it("should call getSecurityNoteByProject with correct parameters and return result", async () => {
      const mockRequest: Request<ProjectWithPagination> = {
        payload: {
          projectId: "PROJ",
          limit: 10,
          offset: 0,
        } as ProjectWithPagination,
      } as Request<ProjectWithPagination>;
      const mockNotes = [
        {
          id: "1",
          projectKey: "PROJ",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getSecurityNoteByProject).mockResolvedValue(
        mockNotes as any,
      );

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getSecurityNoteByProject).toHaveBeenCalledWith("PROJ", 10, 0);
    });
  });
});
