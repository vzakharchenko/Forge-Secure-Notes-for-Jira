import { describe, it, expect, vi, beforeEach } from "vitest";
import { OpenSecurityNoteController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteId } from "../../../../shared/dto";
import { OpenSecurityNote } from "../../../../shared/responses";

describe("OpenSecurityNoteController", () => {
  let controller: OpenSecurityNoteController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      isValidLink: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new OpenSecurityNoteController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.OPEN_LINK_SECURITY_NOTE);
    });
  });

  describe("response", () => {
    const validNoteId = "550e8400-e29b-41d4-a716-446655440000";
    it("should call isValidLink with payload id and return result", async () => {
      const mockRequest: Request = {
        payload: { id: validNoteId } as SecurityNoteId,
      } as Request;
      const mockResult: OpenSecurityNote = {
        valid: true,
        sourceAccountId: "hash-123",
      };
      vi.mocked(mockSecurityNoteService.isValidLink).mockResolvedValue(mockResult);

      const result = await controller.response(mockRequest);

      expect(result).toEqual(mockResult);
      expect(mockSecurityNoteService.isValidLink).toHaveBeenCalledWith(validNoteId);
    });
  });
});
