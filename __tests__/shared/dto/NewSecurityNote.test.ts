import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { NewSecurityNote } from "../../../shared/dto";

describe("NewSecurityNote", () => {
  it("should pass validation with valid data", async () => {
    const note = new NewSecurityNote();
    note.targetUsers = [{ accountId: "user-123", userName: "User" }];
    note.expiry = "1d";
    note.encryptionKeyHash = "hash-123";
    note.encryptedPayload = "encrypted-data";
    note.iv = "iv-123";
    note.salt = "salt-123";
    note.description = "Test description";

    const errors = await validate(note);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with empty targetUsers", async () => {
    const note = new NewSecurityNote();
    note.targetUsers = [];
    note.expiry = "1d";
    note.encryptionKeyHash = "hash-123";
    note.encryptedPayload = "encrypted-data";
    note.iv = "iv-123";
    note.salt = "salt-123";
    note.description = "Test description";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "targetUsers")).toBe(true);
  });

  it("should fail validation with empty expiry", async () => {
    const note = new NewSecurityNote();
    note.targetUsers = [{ accountId: "user-123", userName: "User" }];
    note.expiry = "";
    note.encryptionKeyHash = "hash-123";
    note.encryptedPayload = "encrypted-data";
    note.iv = "iv-123";
    note.salt = "salt-123";
    note.description = "Test description";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "expiry")).toBe(true);
  });

  it("should fail validation with too short encryptionKeyHash", async () => {
    const note = new NewSecurityNote();
    note.targetUsers = [{ accountId: "user-123", userName: "User" }];
    note.expiry = "1d";
    note.encryptionKeyHash = "ab";
    note.encryptedPayload = "encrypted-data";
    note.iv = "iv-123";
    note.salt = "salt-123";
    note.description = "Test description";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "encryptionKeyHash")).toBe(true);
  });

  it("should fail validation with missing required fields", async () => {
    const note = new NewSecurityNote();
    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
  });
});
