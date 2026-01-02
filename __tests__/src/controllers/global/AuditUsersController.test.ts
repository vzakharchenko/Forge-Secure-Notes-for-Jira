import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditUsersController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { AuditUsers } from "../../../../shared/responses";

describe("AuditUsersController", () => {
  let controller: AuditUsersController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getSecurityNoteUsers: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new AuditUsersController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.AUDIT_USERS_ALL);
    });
  });

  describe("response", () => {
    it("should call getSecurityNoteUsers and return result", async () => {
      const mockResult: AuditUsers = {
        result: [{ accountId: "user-123", displayName: "Test User", avatarUrl: "url" }],
      };
      vi.mocked(mockSecurityNoteService.getSecurityNoteUsers).mockResolvedValue(mockResult.result);

      const result = await controller.response();

      expect(result).toEqual(mockResult);
      expect(mockSecurityNoteService.getSecurityNoteUsers).toHaveBeenCalledTimes(1);
    });
  });
});
