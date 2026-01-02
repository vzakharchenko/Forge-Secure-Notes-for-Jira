import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { SecurityNoteId } from "../../../shared/dto";

describe("SecurityNoteId", () => {
  it("should pass validation with valid id", async () => {
    const noteId = new SecurityNoteId();
    noteId.id = "note-123";

    const errors = await validate(noteId);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with empty id", async () => {
    const noteId = new SecurityNoteId();
    noteId.id = "";

    const errors = await validate(noteId);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "id")).toBe(true);
  });

  it("should fail validation with too short id", async () => {
    const noteId = new SecurityNoteId();
    noteId.id = "ab";

    const errors = await validate(noteId);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "id")).toBe(true);
  });

  it("should fail validation with missing id", async () => {
    const noteId = new SecurityNoteId();
    const errors = await validate(noteId);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "id")).toBe(true);
  });
});
