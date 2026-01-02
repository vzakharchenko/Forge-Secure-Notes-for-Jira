import { describe, it, expect } from "vitest";
import { FORGE_INJECTION_TOKENS } from "../../../src/constants";

describe("FORGE_INJECTION_TOKENS", () => {
  it("should export an object with all injection tokens", () => {
    expect(FORGE_INJECTION_TOKENS).toBeDefined();
    expect(typeof FORGE_INJECTION_TOKENS).toBe("object");
  });

  it("should have all service tokens defined", () => {
    expect(FORGE_INJECTION_TOKENS.AnalyticService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.BootstrapService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.ContextService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.RovoServiceImpl).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.SecurityNoteService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.SecurityNoteRepository).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.SecurityStorage).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.JiraUserService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.AsyncService).toBeDefined();
  });

  it("should have all controller tokens defined", () => {
    expect(FORGE_INJECTION_TOKENS.AuditUserController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.AuditUsersController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.BootStrapController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.FetchSecurityNoteController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.IssueAuditController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.IssueProjectsController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.OpenSecurityNoteController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.ProjectAuditController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.CreateSecurityNoteController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.DeleteSecurityNoteController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.GetMySecurityNotesController).toBeDefined();
  });

  it("should have all trigger tokens defined", () => {
    expect(FORGE_INJECTION_TOKENS.ApplySchemaMigrationTrigger).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.DropSchemaMigrationTrigger).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.FiveMinutesTrigger).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.SlowQueryTriggerTrigger).toBeDefined();
  });

  it("should have all tokens as Symbols", () => {
    const allTokens = Object.values(FORGE_INJECTION_TOKENS);
    allTokens.forEach((token) => {
      expect(typeof token).toBe("symbol");
    });
  });

  it("should have unique symbols for all tokens", () => {
    const allTokens = Object.values(FORGE_INJECTION_TOKENS);
    const uniqueTokens = new Set(allTokens);
    expect(uniqueTokens.size).toBe(allTokens.length);
  });

  it("should have symbols created with Symbol.for", () => {
    // Symbol.for creates global symbols, so we can verify by checking if they're the same
    const analyticServiceToken1 = Symbol.for("AnalyticService");
    const analyticServiceToken2 = FORGE_INJECTION_TOKENS.AnalyticService;
    expect(analyticServiceToken1).toBe(analyticServiceToken2);
  });

  it("should have all expected keys", () => {
    const expectedKeys = [
      "AnalyticService",
      "BootstrapService",
      "ContextService",
      "KVSSchemaMigrationService",
      "RovoServiceImpl",
      "SecurityNoteService",
      "AuditUserController",
      "AuditUsersController",
      "BootStrapController",
      "FetchSecurityNoteController",
      "IssueAuditController",
      "IssueProjectsController",
      "OpenSecurityNoteController",
      "ProjectAuditController",
      "CreateSecurityNoteController",
      "DeleteSecurityNoteController",
      "GetMySecurityNotesController",
      "ApplySchemaMigrationTrigger",
      "DropSchemaMigrationTrigger",
      "FiveMinutesTrigger",
      "SlowQueryTriggerTrigger",
      "SecurityNoteRepository",
      "SecurityStorage",
      "JiraUserService",
      "AsyncService",
    ];

    const actualKeys = Object.keys(FORGE_INJECTION_TOKENS);
    expect(actualKeys.length).toBe(expectedKeys.length);
    expectedKeys.forEach((key) => {
      expect(actualKeys).toContain(key);
    });
  });
});
