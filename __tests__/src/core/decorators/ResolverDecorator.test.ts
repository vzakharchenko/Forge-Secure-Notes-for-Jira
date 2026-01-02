import { describe, it, expect } from "vitest";
import "reflect-metadata";
import { resolver, isResolver } from "../../../../src/core";
import { ActualResolver } from "../../../../src/controllers";
import { ErrorResponse } from "../../../../shared/Types";

describe("ResolverDecorator", () => {
  describe("resolver", () => {
    it("should mark class as resolver when it extends ActualResolver", () => {
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }
      }

      const DecoratedResolver = resolver(TestResolver);
      const instance = new DecoratedResolver();

      expect(isResolver(instance)).toBeTruthy();
    });

    it("should throw error when class does not extend ActualResolver", () => {
      class NotActualResolver {
        test() {
          return "test";
        }
      }

      expect(() => resolver(NotActualResolver as any)).toThrow(
        "@resolver you can use only with ActualResolver",
      );
    });

    it("should throw error when class does not have response method", () => {
      class InvalidResolver {
        functionName(): string {
          return "test";
        }
      }

      expect(() => resolver(InvalidResolver as any)).toThrow(
        "@resolver you can use only with ActualResolver",
      );
    });

    it("should return the same constructor", () => {
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }
      }

      const DecoratedResolver = resolver(TestResolver);

      expect(DecoratedResolver).toBe(TestResolver);
    });
  });

  describe("isResolver", () => {
    it("should return true for resolver instance", () => {
      @resolver
      class TestResolver extends ActualResolver<ErrorResponse> {
        functionName(): string {
          return "test";
        }
        async response(): Promise<ErrorResponse> {
          return { isError: false };
        }
      }

      const instance = new TestResolver();

      expect(isResolver(instance)).toBeTruthy();
    });

    it("should return false for non-resolver instance", () => {
      class NotResolver {
        test() {
          return "test";
        }
      }

      const instance = new NotResolver();

      expect(isResolver(instance as any)).toBeFalsy();
    });
  });
});
