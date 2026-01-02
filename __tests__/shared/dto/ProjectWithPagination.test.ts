import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { ProjectWithPagination } from "../../../shared/dto";

describe("ProjectWithPagination", () => {
  it("should pass validation with valid data", async () => {
    const pagination = new ProjectWithPagination();
    pagination.projectId = "project-123";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with empty projectId", async () => {
    const pagination = new ProjectWithPagination();
    pagination.projectId = "";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "projectId")).toBe(true);
  });

  it("should fail validation with too short projectId", async () => {
    const pagination = new ProjectWithPagination();
    pagination.projectId = "ab";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "projectId")).toBe(true);
  });

  it("should fail validation with missing projectId", async () => {
    const pagination = new ProjectWithPagination();
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "projectId")).toBe(true);
  });
});
