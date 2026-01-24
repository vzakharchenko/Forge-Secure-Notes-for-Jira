import { describe, it, expect } from "vitest";
import {
  calculateSaltHash,
  decodeJwtPayload,
  verifyHashConstantTime,
} from "../../../../src/core/utils/cryptoUtils";

describe("cryptoUtils", () => {
  describe("calculateSaltHash", () => {
    it("should calculate hash for password and accountId", async () => {
      const password = "test-password";
      const accountId = "user-123";

      const result = await calculateSaltHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64); // SHA256 hex string is 64 characters
      expect(result).toMatch(/^[0-9a-f]{64}$/); // Should be hexadecimal
    });

    it("should return different hashes for different passwords", async () => {
      const accountId = "user-123";
      const hash1 = await calculateSaltHash("password1", accountId);
      const hash2 = await calculateSaltHash("password2", accountId);

      expect(hash1).not.toBe(hash2);
    });

    it("should return different hashes for different accountIds", async () => {
      const password = "test-password";
      const hash1 = await calculateSaltHash(password, "user-123");
      const hash2 = await calculateSaltHash(password, "user-456");

      expect(hash1).not.toBe(hash2);
    });

    it("should return consistent hash for same inputs", async () => {
      const password = "test-password";
      const accountId = "user-123";

      const hash1 = await calculateSaltHash(password, accountId);
      const hash2 = await calculateSaltHash(password, accountId);

      expect(hash1).toBe(hash2);
    });

    it("should handle empty password", async () => {
      const accountId = "user-123";
      const result = await calculateSaltHash("", accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });

    it("should handle empty accountId", async () => {
      const password = "test-password";
      const result = await calculateSaltHash(password, "");

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });

    it("should handle special characters in password", async () => {
      const password = "p@ssw0rd!@#$%^&*()";
      const accountId = "user-123";
      const result = await calculateSaltHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });

    it("should handle special characters in accountId", async () => {
      const password = "test-password";
      const accountId = "user@example.com";
      const result = await calculateSaltHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });

    it("should handle unicode characters", async () => {
      const password = "пароль";
      const accountId = "пользователь";
      const result = await calculateSaltHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });

    it("should handle very long strings", async () => {
      const password = "a".repeat(1000);
      const accountId = "b".repeat(1000);
      const result = await calculateSaltHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64);
    });
  });

  describe("decodeJwtPayload", () => {
    it("should decode valid JWT payload", () => {
      // Create a valid JWT token (header.payload.signature)
      const payload = { accountId: "user-123", name: "Test User" };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should handle JWT with padding", () => {
      const payload = { test: "data" };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should handle JWT with different padding lengths", () => {
      // Test with payload that needs 1 padding character
      const payload1 = { a: "b" };
      const payloadB64_1 = Buffer.from(JSON.stringify(payload1)).toString("base64");
      const payloadB64Url_1 = payloadB64_1
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const token1 = `header.${payloadB64Url_1}.signature`;
      const result1 = decodeJwtPayload(token1);
      expect(result1).toEqual(payload1);

      // Test with payload that needs 2 padding characters
      const payload2 = { ab: "cd" };
      const payloadB64_2 = Buffer.from(JSON.stringify(payload2)).toString("base64");
      const payloadB64Url_2 = payloadB64_2
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
      const token2 = `header.${payloadB64Url_2}.signature`;
      const result2 = decodeJwtPayload(token2);
      expect(result2).toEqual(payload2);
    });

    it("should throw error for invalid JWT format", () => {
      const invalidToken = "not-a-jwt";

      expect(() => decodeJwtPayload(invalidToken)).toThrow("Not a JWT");
    });

    it("should throw error for JWT without payload", () => {
      const invalidToken = "header.";

      expect(() => decodeJwtPayload(invalidToken)).toThrow("Not a JWT");
    });

    it("should throw error for JWT with only header", () => {
      const invalidToken = "header";

      expect(() => decodeJwtPayload(invalidToken)).toThrow("Not a JWT");
    });

    it("should throw error for empty token", () => {
      expect(() => decodeJwtPayload("")).toThrow("Not a JWT");
    });

    it("should decode JWT with complex payload", () => {
      const payload = {
        accountId: "user-123",
        email: "test@example.com",
        roles: ["admin", "user"],
        metadata: { key: "value" },
      };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should decode JWT with empty payload object", () => {
      const payload = {};
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should decode JWT with null values in payload", () => {
      const payload = { accountId: "user-123", value: null };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should decode JWT with unicode characters in payload", () => {
      const payload = { accountId: "user-123", name: "Тест" };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should handle JWT with very long payload", () => {
      const payload = { data: "a".repeat(1000) };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });

    it("should correctly replace base64url characters", () => {
      // Create a payload that will have + and / characters in base64
      const payload = { test: "data+with/special" };
      const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64");
      const payloadB64Url = payloadB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      const token = `header.${payloadB64Url}.signature`;

      const result = decodeJwtPayload(token);

      expect(result).toEqual(payload);
    });
  });

  describe("verifyHashConstantTime", () => {
    it("should not throw when hashes match", () => {
      const hash1 = "a".repeat(64); // 64 hex chars = 32 bytes
      const hash2 = "a".repeat(64);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).not.toThrow();
    });

    it("should throw error when hashes don't match", () => {
      const hash1 = "a".repeat(64);
      const hash2 = "b".repeat(64);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should throw error with custom message when hashes don't match", () => {
      const hash1 = "a".repeat(64);
      const hash2 = "b".repeat(64);
      const customMessage = "SecurityKey is not valid, please ask John to sent you it.";

      expect(() => verifyHashConstantTime(hash1, hash2, customMessage)).toThrow(customMessage);
    });

    it("should throw error when hashes have different lengths", () => {
      const hash1 = "a".repeat(64); // 32 bytes
      const hash2 = "b".repeat(32); // 16 bytes
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should throw error when stored hash is shorter", () => {
      const hash1 = "a".repeat(32);
      const hash2 = "b".repeat(64);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should work with real hash values from calculateSaltHash", async () => {
      const password = "test-password";
      const accountId = "user-123";
      const hash1 = await calculateSaltHash(password, accountId);
      const hash2 = await calculateSaltHash(password, accountId);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).not.toThrow();
    });

    it("should throw when comparing different real hash values", async () => {
      const hash1 = await calculateSaltHash("password1", "user-123");
      const hash2 = await calculateSaltHash("password2", "user-123");
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should handle edge case with single character difference", () => {
      const hash1 = "a".repeat(63) + "b"; // Last char differs
      const hash2 = "a".repeat(64);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should handle edge case with first character difference", () => {
      const hash1 = "b" + "a".repeat(63);
      const hash2 = "a".repeat(64);
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });

    it("should handle empty hex strings", () => {
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime("", "", errorMessage)).not.toThrow();
    });

    it("should handle minimum valid hex string length", () => {
      const hash1 = "ab";
      const hash2 = "ab";
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).not.toThrow();
    });

    it("should throw when minimum length strings differ", () => {
      const hash1 = "ab";
      const hash2 = "cd";
      const errorMessage = "Hashes don't match";

      expect(() => verifyHashConstantTime(hash1, hash2, errorMessage)).toThrow(errorMessage);
    });
  });
});
