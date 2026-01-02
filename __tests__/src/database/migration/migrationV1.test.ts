import { describe, it, expect, vi, beforeEach } from "vitest";
import { MigrationRunner } from "@forge/sql/out/migration";
import migrationV1 from "../../../../src/database/migration/migrationV1";

describe("migrationV1", () => {
  let mockMigrationRunner: MigrationRunner;
  let mockEnqueue: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockEnqueue = vi.fn().mockReturnThis();
    mockMigrationRunner = {
      enqueue: mockEnqueue,
    } as unknown as MigrationRunner;
  });

  it("should call enqueue with correct migration name and SQL", () => {
    const result = migrationV1(mockMigrationRunner);

    expect(mockEnqueue).toHaveBeenCalledTimes(1);
    expect(mockEnqueue).toHaveBeenCalledWith(
      "v1_MIGRATION0",
      expect.stringContaining("CREATE TABLE `security_notes`"),
    );
    expect(result).toBe(mockMigrationRunner);
  });

  it("should return the migration runner", () => {
    const result = migrationV1(mockMigrationRunner);

    expect(result).toBe(mockMigrationRunner);
  });

  it("should include security_notes table creation SQL", () => {
    migrationV1(mockMigrationRunner);

    const sqlCall = mockEnqueue.mock.calls[0][1];
    expect(sqlCall).toContain("CREATE TABLE `security_notes`");
    expect(sqlCall).toContain("id");
    expect(sqlCall).toContain("target_user_id");
    expect(sqlCall).toContain("created_at");
  });
});
