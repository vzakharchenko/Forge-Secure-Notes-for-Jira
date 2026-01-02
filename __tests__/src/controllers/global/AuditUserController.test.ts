import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuditUsersController } from "../../../../src/controllers/global/AuditUserController";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityAccountId } from "../../../../shared/dto";

describe("AuditUserController", () => {
  let controller: AuditUsersController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getSecurityNoteByAccountId: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new AuditUsersController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.AUDIT_DATA_PER_USER);
    });
  });

  describe("response", () => {
    it("should call getSecurityNoteByAccountId with payload accountId and return result", async () => {
      const mockRequest: Request<SecurityAccountId> = {
        payload: {
          accountId: "user-123",
          limit: 10,
          offset: 0,
        } as SecurityAccountId,
        context: {
          accountId: "context-user-123",
        },
      } as Request<SecurityAccountId>;
      const mockNotes = [
        {
          id: "1",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getSecurityNoteByAccountId).mockResolvedValue(
        mockNotes as any,
      );

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getSecurityNoteByAccountId).toHaveBeenCalledWith(
        "user-123",
        10,
        0,
      );
    });

    it("should use context accountId when payload accountId is not provided", async () => {
      const mockRequest: Request<SecurityAccountId> = {
        payload: {
          limit: 10,
          offset: 0,
        } as SecurityAccountId,
        context: {
          accountId: "context-user-123",
        },
      } as Request<SecurityAccountId>;
      const mockNotes = [
        {
          id: "1",
          createdBy: { accountId: "context-user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getSecurityNoteByAccountId).mockResolvedValue(
        mockNotes as any,
      );

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getSecurityNoteByAccountId).toHaveBeenCalledWith(
        "context-user-123",
        10,
        0,
      );
    });

    it("should use default limit and offset when not provided", async () => {
      const mockRequest: Request<SecurityAccountId> = {
        payload: {
          accountId: "user-123",
        } as SecurityAccountId,
        context: {
          accountId: "context-user-123",
        },
      } as Request<SecurityAccountId>;
      const mockNotes = [
        {
          id: "1",
          createdBy: { accountId: "user-123", displayName: "User", avatarUrl: "url" },
        },
      ];
      vi.mocked(mockSecurityNoteService.getSecurityNoteByAccountId).mockResolvedValue(
        mockNotes as any,
      );

      const result = await controller.response(mockRequest);

      expect(result).toEqual({ result: mockNotes });
      expect(mockSecurityNoteService.getSecurityNoteByAccountId).toHaveBeenCalledWith(
        "user-123",
        10,
        0,
      );
    });
  });
});
