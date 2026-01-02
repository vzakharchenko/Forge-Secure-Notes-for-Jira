import { describe, it, expect } from "vitest";
import { calculateHash, decodeJwtPayload } from "../../../../src/core/utils/cryptoUtils";

describe("cryptoUtils", () => {
  describe("calculateHash", () => {
    it("should calculate hash for password and accountId", async () => {
      const password = "test-password";
      const accountId = "user-123";

      const result = await calculateHash(password, accountId);

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBe(64); // SHA256 hex string is 64 characters
    });

    it("should return different hashes for different passwords", async () => {
      const accountId = "user-123";
      const hash1 = await calculateHash("password1", accountId);
      const hash2 = await calculateHash("password2", accountId);

      expect(hash1).not.toBe(hash2);
    });

    it("should return different hashes for different accountIds", async () => {
      const password = "test-password";
      const hash1 = await calculateHash(password, "user-123");
      const hash2 = await calculateHash(password, "user-456");

      expect(hash1).not.toBe(hash2);
    });

    it("should return consistent hash for same inputs", async () => {
      const password = "test-password";
      const accountId = "user-123";

      const hash1 = await calculateHash(password, accountId);
      const hash2 = await calculateHash(password, accountId);

      expect(hash1).toBe(hash2);
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

    it("should throw error for invalid JWT format", () => {
      const invalidToken = "not-a-jwt";

      expect(() => decodeJwtPayload(invalidToken)).toThrow("Not a JWT");
    });

    it("should throw error for JWT without payload", () => {
      const invalidToken = "header.";

      expect(() => decodeJwtPayload(invalidToken)).toThrow("Not a JWT");
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
  });
});
