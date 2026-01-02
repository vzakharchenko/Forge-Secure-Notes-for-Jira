import { describe, it, expect } from "vitest";
import { ResolverNames } from "../../shared/ResolverNames";

describe("ResolverNames", () => {
  it("should be an enum with all expected values", () => {
    expect(ResolverNames.GET_MY_SECURED_NOTES).toBe("getMySecuredNotes");
    expect(ResolverNames.CREATE_SECURITY_NOTE).toBe("createSecurityNote");
    expect(ResolverNames.DELETE_SECURITY_NOTE).toBe("deleteSecurityNote");
    expect(ResolverNames.OPEN_LINK_SECURITY_NOTE).toBe("openSecurityNote");
    expect(ResolverNames.FETCH_SECURITY_NOTE).toBe("fetchSecurityNote");
    expect(ResolverNames.AUDIT_USERS_ALL).toBe("auditUsers");
    expect(ResolverNames.AUDIT_ISSUES_AND_PROJECTS).toBe("auditIssuesAndProjects");
    expect(ResolverNames.AUDIT_DATA_PER_USER).toBe("auditDataPerUser");
    expect(ResolverNames.AUDIT_DATA_PER_ISSUE).toBe("auditDataPerIssue");
    expect(ResolverNames.AUDIT_DATA_PER_PROJECT).toBe("auditDataPerProject");
    expect(ResolverNames.BOOTSTRAP).toBe("bootstrap");
  });

  it("should have all values as strings", () => {
    const values = Object.values(ResolverNames);
    values.forEach((value) => {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it("should have unique values", () => {
    const values = Object.values(ResolverNames);
    const uniqueValues = new Set(values);
    expect(values.length).toBe(uniqueValues.size);
  });

  it("should have camelCase naming convention", () => {
    const values = Object.values(ResolverNames);
    values.forEach((value) => {
      // Check that it's camelCase (starts with lowercase, no spaces, no underscores except at word boundaries)
      expect(value).toMatch(/^[a-z][a-zA-Z0-9]*$/);
    });
  });
});
