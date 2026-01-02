import { describe, it, expect, vi, beforeEach } from "vitest";
import { MigrationRunner } from "@forge/sql/out/migration";
import migrationV2 from "../../../../src/database/migration/migrationV2";

describe("migrationV2", () => {
  let mockMigrationRunner: MigrationRunner;
  let mockEnqueue: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEnqueue = vi.fn().mockReturnThis();
    mockMigrationRunner = {
      enqueue: mockEnqueue,
    } as unknown as MigrationRunner;
  });

  it("should call enqueue twice for two migrations", () => {
    const result = migrationV2(mockMigrationRunner);

    expect(mockEnqueue).toHaveBeenCalledTimes(2);
    expect(result).toBe(mockMigrationRunner);
  });

  it("should add project_id column", () => {
    migrationV2(mockMigrationRunner);

    expect(mockEnqueue).toHaveBeenCalledWith(
      "v2_MIGRATION0",
      expect.stringContaining("ADD COLUMN IF NOT EXISTS `project_id`"),
    );
  });

  it("should add project_key column", () => {
    migrationV2(mockMigrationRunner);

    expect(mockEnqueue).toHaveBeenCalledWith(
      "v2_MIGRATION1",
      expect.stringContaining("ADD COLUMN IF NOT EXISTS `project_key`"),
    );
  });

  it("should chain enqueue calls correctly", () => {
    migrationV2(mockMigrationRunner);

    // Verify that enqueue returns this for chaining
    expect(mockEnqueue).toHaveReturnedWith(mockMigrationRunner);
  });
});
