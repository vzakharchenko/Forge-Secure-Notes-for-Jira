import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { IssueIdWithPagination } from "../../../shared/dto";

describe("IssueIdWithPagination", () => {
  it("should pass validation with valid data", async () => {
    const pagination = new IssueIdWithPagination();
    pagination.issueId = "issue-123";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with empty issueId", async () => {
    const pagination = new IssueIdWithPagination();
    pagination.issueId = "";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "issueId")).toBe(true);
  });

  it("should fail validation with too short issueId", async () => {
    const pagination = new IssueIdWithPagination();
    pagination.issueId = "ab";
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "issueId")).toBe(true);
  });

  it("should fail validation with missing issueId", async () => {
    const pagination = new IssueIdWithPagination();
    pagination.limit = 10;
    pagination.offset = 0;

    const errors = await validate(pagination);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "issueId")).toBe(true);
  });
});
