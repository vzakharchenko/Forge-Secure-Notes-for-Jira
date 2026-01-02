import { describe, it, expect, vi, beforeEach } from "vitest";
import { MigrationRunner } from "@forge/sql/out/migration";
import migrationV3 from "../../../../src/database/migration/migrationV3";

describe("migrationV3", () => {
  let mockMigrationRunner: MigrationRunner;
  let mockEnqueue: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEnqueue = vi.fn().mockReturnThis();
    mockMigrationRunner = {
      enqueue: mockEnqueue,
    } as unknown as MigrationRunner;
  });

  it("should call enqueue with correct migration name and SQL", () => {
    const result = migrationV3(mockMigrationRunner);

    expect(mockEnqueue).toHaveBeenCalledTimes(1);
    expect(mockEnqueue).toHaveBeenCalledWith(
      "v3_MIGRATION0",
      expect.stringContaining("ADD COLUMN IF NOT EXISTS `description`"),
    );
    expect(result).toBe(mockMigrationRunner);
  });

  it("should return the migration runner", () => {
    const result = migrationV3(mockMigrationRunner);

    expect(result).toBe(mockMigrationRunner);
  });

  it("should add description column to security_notes table", () => {
    migrationV3(mockMigrationRunner);

    const sqlCall = mockEnqueue.mock.calls[0][1];
    expect(sqlCall).toContain("ALTER TABLE `security_notes`");
    expect(sqlCall).toContain("ADD COLUMN IF NOT EXISTS `description`");
    expect(sqlCall).toContain("varchar(255) NULL");
  });
});
