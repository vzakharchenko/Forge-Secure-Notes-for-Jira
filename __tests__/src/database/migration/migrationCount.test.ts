import { describe, it, expect } from "vitest";
import { MIGRATION_VERSION } from "../../../../src/database/migration/migrationCount";

describe("migrationCount", () => {
  it("should export MIGRATION_VERSION as a number", () => {
    expect(MIGRATION_VERSION).toBeDefined();
    expect(typeof MIGRATION_VERSION).toBe("number");
  });

  it("should have MIGRATION_VERSION greater than 0", () => {
    expect(MIGRATION_VERSION).toBeGreaterThan(0);
  });
});
