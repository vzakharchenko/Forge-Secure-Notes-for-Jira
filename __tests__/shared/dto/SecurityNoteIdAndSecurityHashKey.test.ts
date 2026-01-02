import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { SecurityNoteIdAndSecurityHashKey } from "../../../shared/dto";

describe("SecurityNoteIdAndSecurityHashKey", () => {
  it("should pass validation with valid id and keyHash", async () => {
    const note = new SecurityNoteIdAndSecurityHashKey();
    note.id = "note-123";
    note.keyHash = "hash-123";

    const errors = await validate(note);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with empty id", async () => {
    const note = new SecurityNoteIdAndSecurityHashKey();
    note.id = "";
    note.keyHash = "hash-123";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "id")).toBe(true);
  });

  it("should fail validation with empty keyHash", async () => {
    const note = new SecurityNoteIdAndSecurityHashKey();
    note.id = "note-123";
    note.keyHash = "";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "keyHash")).toBe(true);
  });

  it("should fail validation with too short id", async () => {
    const note = new SecurityNoteIdAndSecurityHashKey();
    note.id = "ab";
    note.keyHash = "hash-123";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "id")).toBe(true);
  });

  it("should fail validation with too short keyHash", async () => {
    const note = new SecurityNoteIdAndSecurityHashKey();
    note.id = "note-123";
    note.keyHash = "ab";

    const errors = await validate(note);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "keyHash")).toBe(true);
  });
});
