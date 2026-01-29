import { describe, it, expect, vi, beforeEach } from "vitest";
import { FetchSecurityNoteController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteIdAndSecurityHashKey } from "../../../../shared/dto";
import { PERMISSION_ERROR_OBJECT, SecurityNoteData } from "../../../../shared/responses";

describe("FetchSecurityNoteController", () => {
  let controller: FetchSecurityNoteController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getSecuredData: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new FetchSecurityNoteController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.FETCH_SECURITY_NOTE);
    });
  });

  describe("response", () => {
    const validNoteId = "550e8400-e29b-41d4-a716-446655440000";
    it("should call getSecuredData and return result when data exists", async () => {
      const mockRequest: Request = {
        payload: {
          id: validNoteId,
          keyHash: "key-hash-123",
        } as SecurityNoteIdAndSecurityHashKey,
      } as Request;
      const mockResult: SecurityNoteData = {
        id: validNoteId,
        iv: "iv-123",
        salt: "salt-123",
        encryptedData: "encrypted-data",
        viewTimeOut: 300,
        expiry: "1d",
      };
      vi.mocked(mockSecurityNoteService.getSecuredData).mockResolvedValue(mockResult);

      const result = await controller.response(mockRequest);

      expect(result).toEqual(mockResult);
      expect(mockSecurityNoteService.getSecuredData).toHaveBeenCalledWith(
        validNoteId,
        "key-hash-123",
      );
    });

    it("should return PERMISSION_ERROR_OBJECT when data does not exist", async () => {
      const mockRequest: Request = {
        payload: {
          id: validNoteId,
          keyHash: "key-hash-123",
        } as SecurityNoteIdAndSecurityHashKey,
      } as Request;
      vi.mocked(mockSecurityNoteService.getSecuredData).mockResolvedValue(undefined);

      const result = await controller.response(mockRequest);

      expect(result).toEqual(PERMISSION_ERROR_OBJECT);
      expect(mockSecurityNoteService.getSecuredData).toHaveBeenCalledWith(
        validNoteId,
        "key-hash-123",
      );
    });
  });
});
