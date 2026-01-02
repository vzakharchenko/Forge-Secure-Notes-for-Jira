import { describe, it, expect } from "vitest";
import {
  GeneralContext,
  Context,
  LicenseDetails,
  BaseContext,
  GlobalJiraContext,
  Issue,
  Project,
  IssueContext,
  isIssueContext,
} from "../../../../src/core";

describe("ContextTypes", () => {
  describe("Type definitions", () => {
    it("should have correct GeneralContext structure", () => {
      const context: GeneralContext = {
        key1: "value1",
        key2: 123,
        key3: { nested: "object" },
      };

      expect(context.key1).toBe("value1");
      expect(context.key2).toBe(123);
      expect(context.key3).toEqual({ nested: "object" });
    });

    it("should have correct LicenseDetails structure", () => {
      const license: LicenseDetails = {
        active: true,
        billingPeriod: "monthly",
        ccpEntitlementId: "ent-123",
        ccpEntitlementSlug: "slug-123",
        isEvaluation: false,
        subscriptionEndDate: "2024-12-31",
        supportEntitlementNumber: "support-123",
        trialEndDate: null,
        type: "paid",
      };

      expect(license.active).toBe(true);
      expect(license.billingPeriod).toBe("monthly");
      expect(license.subscriptionEndDate).toBe("2024-12-31");
      expect(license.trialEndDate).toBeNull();
    });

    it("should have correct Issue structure", () => {
      const issue: Issue = {
        key: "TEST-1",
        id: "issue-123",
        type: "Bug",
        typeId: "type-123",
      };

      expect(issue.key).toBe("TEST-1");
      expect(issue.id).toBe("issue-123");
      expect(issue.type).toBe("Bug");
    });

    it("should have correct Project structure", () => {
      const project: Project = {
        id: "project-123",
        key: "PROJ",
        type: "software",
      };

      expect(project.id).toBe("project-123");
      expect(project.key).toBe("PROJ");
      expect(project.type).toBe("software");
    });

    it("should have correct BaseContext structure", () => {
      const context: BaseContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      expect(context.accountId).toBe("user-123");
      expect(context.localId).toBe("local-123");
      expect(context.cloudId).toBe("cloud-123");
      expect(context.extension.type).toBe("jira:issue");
    });

    it("should have correct GlobalJiraContext structure", () => {
      const context: GlobalJiraContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:globalPage",
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      expect(context.accountId).toBe("user-123");
      expect(context.extension.type).toBe("jira:globalPage");
    });

    it("should have correct IssueContext structure", () => {
      const context: IssueContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            key: "TEST-1",
            id: "issue-123",
            type: "Bug",
            typeId: "type-123",
          },
          project: {
            id: "project-123",
            key: "PROJ",
            type: "software",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      expect(context.accountId).toBe("user-123");
      expect(context.extension.type).toBe("jira:issue");
      expect(context.extension.issue.key).toBe("TEST-1");
      expect(context.extension.project.key).toBe("PROJ");
    });

    it("should have correct Context structure with optional fields", () => {
      const context: Context = {
        accountId: "user-123",
        cloudId: "cloud-123",
        workspaceId: "workspace-123",
        extension: {
          type: "jira:issue",
        },
        environmentId: "env-123",
        environmentType: "production",
        localId: "local-123",
        moduleKey: "module-key",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
        license: {
          active: true,
          billingPeriod: "monthly",
          ccpEntitlementId: "ent-123",
          ccpEntitlementSlug: "slug-123",
          isEvaluation: false,
          subscriptionEndDate: "2024-12-31",
          supportEntitlementNumber: "support-123",
          trialEndDate: null,
          type: "paid",
        },
        surfaceColor: "blue",
      };

      expect(context.accountId).toBe("user-123");
      expect(context.workspaceId).toBe("workspace-123");
      expect(context.license?.active).toBe(true);
      expect(context.surfaceColor).toBe("blue");
    });
  });

  describe("isIssueContext", () => {
    it("should return true for IssueContext", () => {
      const context: IssueContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            key: "TEST-1",
            id: "issue-123",
            type: "Bug",
            typeId: "type-123",
          },
          project: {
            id: "project-123",
            key: "PROJ",
            type: "software",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      const result = isIssueContext(context);

      expect(result).toBe(true);
      // TypeScript should narrow the type here
      if (result) {
        expect(context.extension.issue).toBeDefined();
        expect(context.extension.project).toBeDefined();
      }
    });

    it("should return false for BaseContext without issue and project", () => {
      const context: BaseContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:globalPage",
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      const result = isIssueContext(context);

      expect(result).toBe(false);
    });

    it("should return false for BaseContext with only issue", () => {
      const context = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            key: "TEST-1",
            id: "issue-123",
            type: "Bug",
            typeId: "type-123",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      } as BaseContext;

      const result = isIssueContext(context);

      expect(result).toBe(false);
    });

    it("should return false for BaseContext with only project", () => {
      const context = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          project: {
            id: "project-123",
            key: "PROJ",
            type: "software",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      } as BaseContext;

      const result = isIssueContext(context);

      expect(result).toBe(false);
    });

    it("should return false for BaseContext with undefined issue and project", () => {
      const context = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: undefined,
          project: undefined,
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      } as BaseContext;

      const result = isIssueContext(context);

      expect(result).toBe(false);
    });

    it("should work as type guard in TypeScript", () => {
      const context: BaseContext = {
        accountId: "user-123",
        localId: "local-123",
        cloudId: "cloud-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            key: "TEST-1",
            id: "issue-123",
            type: "Bug",
            typeId: "type-123",
          },
          project: {
            id: "project-123",
            key: "PROJ",
            type: "software",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };

      if (isIssueContext(context)) {
        // TypeScript should narrow to IssueContext here
        expect(context.extension.issue.key).toBe("TEST-1");
        expect(context.extension.project.key).toBe("PROJ");
      } else {
        // This branch should not be reached
        expect(true).toBe(false);
      }
    });
  });
});
