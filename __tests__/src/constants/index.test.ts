import { describe, it, expect } from "vitest";
import { FORGE_INJECTION_TOKENS } from "../../../src/constants";
import { FORGE_INJECTION_TOKENS as DirectImport } from "../../../src/constants/ForgeInjectionTokens";

describe("constants index", () => {
  it("should export FORGE_INJECTION_TOKENS", () => {
    expect(FORGE_INJECTION_TOKENS).toBeDefined();
  });

  it("should export the same FORGE_INJECTION_TOKENS as direct import", () => {
    expect(FORGE_INJECTION_TOKENS).toBe(DirectImport);
  });

  it("should export all tokens correctly through index", () => {
    expect(FORGE_INJECTION_TOKENS.AnalyticService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.SecurityNoteService).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.CreateSecurityNoteController).toBeDefined();
    expect(FORGE_INJECTION_TOKENS.FiveMinutesTrigger).toBeDefined();
  });
});
