import { describe, it, expect } from "vitest";
import {
  ViewTimeOutType,
  SecurityNoteStatus,
  ErrorType,
  ValidationErrors,
  BaseResponse,
  ErrorResponse,
  SHARED_EVENT_NAME,
} from "../../shared/Types";

describe("Types", () => {
  describe("ViewTimeOutType", () => {
    it("should accept valid timeout values", () => {
      const validValues: ViewTimeOutType[] = ["1min", "3mins", "5mins", "15mins", "30mins"];
      validValues.forEach((value) => {
        expect(value).toMatch(/^(1|3|5|15|30)mins?$/);
      });
    });
  });

  describe("SecurityNoteStatus", () => {
    it("should accept valid status values", () => {
      const validValues: SecurityNoteStatus[] = ["NEW", "VIEWED", "DELETED", "EXPIRED"];
      validValues.forEach((value) => {
        expect(["NEW", "VIEWED", "DELETED", "EXPIRED"]).toContain(value);
      });
    });
  });

  describe("ErrorType", () => {
    it("should accept valid error types", () => {
      const validValues: ErrorType[] = [
        "NOT_LICENSING",
        "GENERAL",
        "VALIDATION",
        "INSTALLATION",
        "NO_PERMISSION",
      ];
      validValues.forEach((value) => {
        expect([
          "NOT_LICENSING",
          "GENERAL",
          "VALIDATION",
          "INSTALLATION",
          "NO_PERMISSION",
        ]).toContain(value);
      });
    });
  });

  describe("ValidationErrors", () => {
    it("should match Record<string, string[]> type", () => {
      const validationErrors: ValidationErrors = {
        field1: ["error1", "error2"],
        field2: ["error3"],
      };
      expect(validationErrors).toBeDefined();
      expect(typeof validationErrors).toBe("object");
      expect(Array.isArray(validationErrors.field1)).toBe(true);
      expect(Array.isArray(validationErrors.field2)).toBe(true);
    });
  });

  describe("ErrorResponse", () => {
    it("should have optional error properties", () => {
      const errorResponse: ErrorResponse = {
        isError: true,
        errorType: "GENERAL",
        message: "Test error",
        validationErrors: { field: ["error"] },
      };
      expect(errorResponse.isError).toBe(true);
      expect(errorResponse.errorType).toBe("GENERAL");
      expect(errorResponse.message).toBe("Test error");
      expect(errorResponse.validationErrors).toBeDefined();
    });

    it("should allow partial ErrorResponse", () => {
      const partialError: ErrorResponse = {
        isError: true,
      };
      expect(partialError.isError).toBe(true);
      expect(partialError.errorType).toBeUndefined();
      expect(partialError.message).toBeUndefined();
    });
  });

  describe("BaseResponse", () => {
    it("should extend ErrorResponse and have optional data", () => {
      const baseResponse: BaseResponse<string> = {
        isError: false,
        data: "test data",
      };
      expect(baseResponse.isError).toBe(false);
      expect(baseResponse.data).toBe("test data");
    });

    it("should allow BaseResponse without data", () => {
      const baseResponse: BaseResponse<string> = {
        isError: false,
      };
      expect(baseResponse.isError).toBe(false);
      expect(baseResponse.data).toBeUndefined();
    });
  });

  describe("SHARED_EVENT_NAME", () => {
    it("should be a string constant", () => {
      expect(typeof SHARED_EVENT_NAME).toBe("string");
      expect(SHARED_EVENT_NAME).toBe("refreshIssuePage");
    });
  });
});
