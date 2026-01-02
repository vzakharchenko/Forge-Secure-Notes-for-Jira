import { describe, it, expect, vi, beforeEach } from "vitest";
import "reflect-metadata";
import { validBodyHandler } from "../../../../src/core";
import { resolver } from "../../../../src/core";
import { ActualResolver } from "../../../../src/controllers";
import { ErrorResponse } from "../../../../shared/Types";
import { Request } from "@forge/resolver";
import * as CommonValidator from "../../../../shared/CommonValidator";

vi.mock("../../../../shared/CommonValidator", () => ({
  getValidationErrors: vi.fn(),
}));

describe("ValidBodyHandlerDecorator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return validation error when validation fails", async () => {
    class ValidateClass {
      name: string;
    }

    @resolver
    class TestResolver extends ActualResolver<ErrorResponse> {
      functionName(): string {
        return "test";
      }
      async response(): Promise<ErrorResponse> {
        return { isError: false };
      }

      @validBodyHandler(ValidateClass)
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      async testMethod(request: Request): Promise<ErrorResponse> {
        return { isError: false };
      }
    }

    const validationErrors = { name: ["Name is required"] };
    vi.mocked(CommonValidator.getValidationErrors).mockResolvedValue(validationErrors);

    const instance = new TestResolver();
    const mockRequest = { payload: {} } as Request;

    const result = await instance.testMethod(mockRequest);

    expect(result.isError).toBe(true);
    expect(result.errorType).toBe("VALIDATION");
    expect(result.message).toBe("validation Error");
    expect(result.validationErrors).toEqual(validationErrors);
    expect(CommonValidator.getValidationErrors).toHaveBeenCalledWith(mockRequest, ValidateClass);
  });

  it("should call original method when validation passes", async () => {
    class ValidateClass {
      name: string;
    }

    @resolver
    class TestResolver extends ActualResolver<ErrorResponse> {
      functionName(): string {
        return "test";
      }
      async response(): Promise<ErrorResponse> {
        return { isError: false };
      }

      @validBodyHandler(ValidateClass)
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      async testMethod(request: Request): Promise<ErrorResponse> {
        return { isError: false, data: "success" };
      }
    }

    vi.mocked(CommonValidator.getValidationErrors).mockResolvedValue({});

    const instance = new TestResolver();
    const mockRequest = { payload: { name: "test" } } as Request;

    const result = await instance.testMethod(mockRequest);

    expect(result.isError).toBe(false);
    expect(result.data).toBe("success");
    expect(CommonValidator.getValidationErrors).toHaveBeenCalledWith(mockRequest, ValidateClass);
  });

  it("should throw error when used without @resolver decorator", async () => {
    class ValidateClass {
      name: string;
    }

    class TestResolver extends ActualResolver<ErrorResponse> {
      functionName(): string {
        return "test";
      }
      async response(): Promise<ErrorResponse> {
        return { isError: false };
      }

      @validBodyHandler(ValidateClass)
      // eslint-disable-next-line  @typescript-eslint/no-unused-vars
      async testMethod(request: Request): Promise<ErrorResponse> {
        return { isError: false };
      }
    }

    vi.mocked(CommonValidator.getValidationErrors).mockResolvedValue({});

    const instance = new TestResolver();
    const mockRequest = { payload: {} } as Request;

    await expect(instance.testMethod(mockRequest)).rejects.toThrow(
      "Error: @validBodyHandler can use only with @resolver.",
    );
  });

  it("should pass request to original method", async () => {
    class ValidateClass {
      name: string;
    }

    @resolver
    class TestResolver extends ActualResolver<ErrorResponse> {
      functionName(): string {
        return "test";
      }
      async response(): Promise<ErrorResponse> {
        return { isError: false };
      }

      @validBodyHandler(ValidateClass)
      async testMethod(request: Request): Promise<ErrorResponse> {
        return { isError: false, data: request.payload };
      }
    }

    vi.mocked(CommonValidator.getValidationErrors).mockResolvedValue({});

    const instance = new TestResolver();
    const mockRequest = { payload: { name: "test" } } as Request;

    const result = await instance.testMethod(mockRequest);

    expect(result.data).toEqual({ name: "test" });
  });
});
