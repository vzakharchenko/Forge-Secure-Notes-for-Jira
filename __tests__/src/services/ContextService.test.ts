import { describe, it, expect, beforeEach } from "vitest";
import { ContextService } from "../../../src/services";
import { Request } from "@forge/resolver";

describe("ContextService", () => {
  let service: ContextService;

  beforeEach(() => {
    service = new ContextService();
  });

  describe("getContext", () => {
    it("should return context from request", () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = service.getContext(mockRequest);

      expect(result).toEqual(mockContext);
    });

    it("should return typed context", () => {
      interface CustomContext {
        accountId: string;
        customField: string;
      }

      const mockContext: CustomContext = {
        accountId: "user-123",
        customField: "value",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = service.getContext<CustomContext>(mockRequest);

      expect(result).toEqual(mockContext);
      expect(result.customField).toBe("value");
    });
  });
});
