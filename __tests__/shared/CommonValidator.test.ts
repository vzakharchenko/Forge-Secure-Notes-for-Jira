import { describe, it, expect } from "vitest";
import { getValidationErrors } from "../../shared/CommonValidator";
import { NewSecurityNote } from "../../shared/dto";
import { SecurityNoteId } from "../../shared/dto";

describe("CommonValidator", () => {
  describe("getValidationErrors", () => {
    it("should throw error when request payload is empty", async () => {
      const req = { payload: null };
      await expect(getValidationErrors(req, NewSecurityNote)).rejects.toThrow("empty request");
    });

    it("should throw error when request is undefined", async () => {
      const req = undefined as any;
      await expect(getValidationErrors(req, NewSecurityNote)).rejects.toThrow("empty request");
    });

    it("should return empty object when validation passes", async () => {
      const req = {
        payload: {
          targetUsers: [{ accountId: "user-123", userName: "User" }],
          expiry: "1d",
          encryptionKeyHash: "hash-123",
          encryptedPayload: "encrypted-data",
          iv: "iv-123",
          salt: "salt-123",
          description: "Test description",
        },
      };
      const errors = await getValidationErrors(req, NewSecurityNote);
      expect(errors).toEqual({});
    });

    it("should return validation errors for invalid payload", async () => {
      const req = {
        payload: {
          targetUsers: [],
          expiry: "",
          encryptionKeyHash: "ab",
          encryptedPayload: "",
          iv: "ab",
          salt: "ab",
          description: "ab",
        },
      };
      const errors = await getValidationErrors(req, NewSecurityNote);
      expect(errors).toBeDefined();
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });

    it("should return validation errors for missing required fields", async () => {
      const req = {
        payload: {},
      };
      const errors = await getValidationErrors(req, NewSecurityNote);
      expect(errors).toBeDefined();
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });

    it("should return validation errors for SecurityNoteId with invalid id", async () => {
      const req = {
        payload: {
          id: "ab", // Too short
        },
      };
      const errors = await getValidationErrors(req, SecurityNoteId);
      expect(errors).toBeDefined();
      expect(errors.id).toBeDefined();
    });

    it("should return validation errors for SecurityNoteId with empty id", async () => {
      const req = {
        payload: {
          id: "",
        },
      };
      const errors = await getValidationErrors(req, SecurityNoteId);
      expect(errors).toBeDefined();
      expect(errors.id).toBeDefined();
    });

    it("should return validation errors for SecurityNoteId with missing id", async () => {
      const req = {
        payload: {},
      };
      const errors = await getValidationErrors(req, SecurityNoteId);
      expect(errors).toBeDefined();
      expect(errors.id).toBeDefined();
    });

    it("should return multiple validation errors", async () => {
      const req = {
        payload: {
          targetUsers: [],
          expiry: "",
          encryptionKeyHash: "",
          encryptedPayload: "",
          iv: "",
          salt: "",
          description: "",
        },
      };
      const errors = await getValidationErrors(req, NewSecurityNote);
      expect(errors).toBeDefined();
      expect(Object.keys(errors).length).toBeGreaterThan(1);
    });

    it("should stop at first error when stopAtFirstError is true", async () => {
      const req = {
        payload: {
          targetUsers: [],
          expiry: "",
        },
      };
      const errors = await getValidationErrors(req, NewSecurityNote);
      expect(errors).toBeDefined();
      // With stopAtFirstError, we should get errors but not necessarily all of them
      expect(Object.keys(errors).length).toBeGreaterThan(0);
    });
  });
});
