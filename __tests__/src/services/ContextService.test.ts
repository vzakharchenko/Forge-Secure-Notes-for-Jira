import { describe, it, expect, beforeEach, vi } from "vitest";
import { ContextService } from "../../../src/services";
import { Request } from "@forge/resolver";
import { JiraUserService } from "../../../src/jira";

describe("ContextService", () => {
  let service: ContextService;
  let mockJiraUserService: JiraUserService;

  beforeEach(() => {
    mockJiraUserService = {
      getIssueByPortalKey: vi.fn(),
    } as unknown as JiraUserService;
    service = new ContextService(mockJiraUserService);
  });

  describe("getContext", () => {
    it("should return context from request", async () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:globalPage",
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(result).toEqual(mockContext);
    });

    it("should return typed context", async () => {
      interface CustomContext {
        accountId: string;
        customField: string;
        localId: string;
        cloudId: string;
        moduleKey: string;
        extension: {
          type: string;
        };
        environmentId: string;
        environmentType: string;
        siteUrl: string;
        timezone: string;
      }

      const mockContext: CustomContext = {
        accountId: "user-123",
        customField: "value",
        localId: "local-123",
        cloudId: "cloud-456",
        moduleKey: "module-key",
        extension: {
          type: "jira:globalPage",
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext<CustomContext>(mockRequest);

      expect(result).toEqual(mockContext);
      expect(result.customField).toBe("value");
    });

    it("should handle portal context and transform it to issue context", async () => {
      const mockCustomerRequest = {
        issueId: "portal-issue-123",
        issueKey: "PORTAL-1",
        requestTypeId: "type-123",
        serviceDeskId: "desk-123",
        active: true,
        summary: "Test request",
        reporter: {
          accountId: "reporter-123",
          displayName: "Reporter",
          _links: {
            avatarUrls: {
              "32x32": "avatar-url",
            },
          },
        },
      };

      vi.mocked(mockJiraUserService.getIssueByPortalKey).mockResolvedValue(mockCustomerRequest);

      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:portal",
          portal: true,
          request: {
            key: "PORTAL-1",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(mockJiraUserService.getIssueByPortalKey).toHaveBeenCalledWith("PORTAL-1");
      expect(result).toHaveProperty("customerRequest", mockCustomerRequest);
      expect(result.extension).toHaveProperty("issue");
      expect(result.extension.issue).toEqual({
        id: "portal-issue-123",
        key: "PORTAL-1",
        type: "type-123",
      });
    });

    it("should return context as-is when portal key is missing", async () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:portal",
          portal: true,
          request: {},
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(mockJiraUserService.getIssueByPortalKey).not.toHaveBeenCalled();
      expect(result).toEqual(mockContext);
    });

    it("should return context as-is when portal is false", async () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:portal",
          portal: false,
          request: {
            key: "PORTAL-1",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(mockJiraUserService.getIssueByPortalKey).not.toHaveBeenCalled();
      expect(result).toEqual(mockContext);
    });

    it("should return context as-is when it is already an IssueContext", async () => {
      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:issue",
          issue: {
            id: "issue-123",
            key: "TEST-1",
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
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(mockJiraUserService.getIssueByPortalKey).not.toHaveBeenCalled();
      expect(result).toEqual(mockContext);
    });

    it("should handle undefined customerRequest from portal", async () => {
      vi.mocked(mockJiraUserService.getIssueByPortalKey).mockResolvedValue(undefined);

      const mockContext = {
        accountId: "user-123",
        cloudId: "cloud-456",
        localId: "local-123",
        moduleKey: "module-key",
        extension: {
          type: "jira:portal",
          portal: true,
          request: {
            key: "PORTAL-1",
          },
        },
        environmentId: "env-123",
        environmentType: "production",
        siteUrl: "https://example.atlassian.net",
        timezone: "UTC",
      };
      const mockRequest = {
        context: mockContext,
      } as Request;

      const result = await service.getContext(mockRequest);

      expect(mockJiraUserService.getIssueByPortalKey).toHaveBeenCalledWith("PORTAL-1");
      expect(result).toHaveProperty("customerRequest", undefined);
      expect(result.extension).toHaveProperty("issue");
      // When customerRequest is undefined, fallback to extension.request.key
      expect(result.extension.issue).toEqual({
        id: "PORTAL-1",
        key: "PORTAL-1",
        type: undefined,
      });
    });
  });
});
