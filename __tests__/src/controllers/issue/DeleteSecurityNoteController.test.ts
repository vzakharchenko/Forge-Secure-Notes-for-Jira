import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteSecurityNoteController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteId } from "../../../../shared/dto";
import * as controllers from "../../../../src/controllers";
import { publishGlobal } from "@forge/realtime";
import { SHARED_EVENT_NAME } from "../../../../shared/Types";
import { IssueContext } from "../../../../src/core";

vi.mock("@forge/realtime", () => ({
  publishGlobal: vi.fn(),
}));

describe("DeleteSecurityNoteController", () => {
  let controller: DeleteSecurityNoteController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      deleteSecurityNote: vi.fn(),
      getMySecurityNoteIssue: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new DeleteSecurityNoteController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.DELETE_SECURITY_NOTE);
    });
  });

  describe("response", () => {
    it("should delete security note, publish event and return result", async () => {
      const mockIssueContext: IssueContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            key: "TEST-1",
            id: "issue-123",
            type: "Bug",
            typeId: "type-123",
          },
          project: {
            id: "project-123",
            key: "PROJ",
            type: "software",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest: Request = {
        payload: {
          id: "note-id-123",
        } as SecurityNoteId,
      } as Request;

      const mockNotes = [
        {
          id: "1",
          issueKey: "TEST-1",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.deleteSecurityNote).mockResolvedValue(undefined);
      vi.mocked(mockSecurityNoteService.getMySecurityNoteIssue).mockResolvedValue(mockNotes as any);
      vi.mocked(publishGlobal).mockResolvedValue(undefined);
      // Set mock for getAppContext using spyOn
      const mockAppContext = {
        accountId: "user-123",
        context: mockIssueContext,
      } as any;
      vi.spyOn(controllers, "getAppContext").mockReturnValue(mockAppContext);

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.deleteSecurityNote).toHaveBeenCalledWith("note-id-123");
      expect(publishGlobal).toHaveBeenCalledWith(SHARED_EVENT_NAME, "issue-123");
      expect(mockSecurityNoteService.getMySecurityNoteIssue).toHaveBeenCalledTimes(1);
    });

    it("should return error response when context is not IssueContext", async () => {
      // Set mock for getAppContext using spyOn
      const mockContext = {
        accountId: "user-123",
        context: {
          extension: {
            type: "jira:globalPage",
          },
        },
      } as any;
      vi.spyOn(controllers, "getAppContext").mockReturnValue(mockContext);

      const mockRequest: Request = {
        payload: {
          id: "note-id-123",
        } as SecurityNoteId,
      } as Request;

      const result = await controller.response(mockRequest);

      expect(result.isError).toBe(true);
      expect(result.errorType).toBe("GENERAL");
      expect(result.message).toBe("expected Issue context");
    });
  });
});
