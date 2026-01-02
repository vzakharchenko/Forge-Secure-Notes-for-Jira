import { describe, it, expect } from "vitest";
import { validate } from "class-validator";
import { SecurityAccountId } from "../../../shared/dto";

describe("SecurityAccountId", () => {
  it("should pass validation with valid accountId", async () => {
    const accountId = new SecurityAccountId();
    accountId.accountId = "user-123";
    accountId.limit = 10;
    accountId.offset = 0;

    const errors = await validate(accountId);
    expect(errors.length).toBe(0);
  });

  it("should pass validation without accountId (optional)", async () => {
    const accountId = new SecurityAccountId();
    accountId.limit = 10;
    accountId.offset = 0;

    const errors = await validate(accountId);
    expect(errors.length).toBe(0);
  });

  it("should fail validation with too short accountId", async () => {
    const accountId = new SecurityAccountId();
    accountId.accountId = "ab";
    accountId.limit = 10;
    accountId.offset = 0;

    const errors = await validate(accountId);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === "accountId")).toBe(true);
  });
});
