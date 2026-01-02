import { describe, it, expect, vi, beforeEach } from "vitest";
import { JiraUserService } from "../../../src/jira";
import { CurrentUser } from "../../../src/jira";
import { GetPermissionsResponse } from "../../../src/jira";
import * as api from "@forge/api";

// Mock @forge/api
vi.mock("@forge/api", () => {
  const requestJira = vi.fn();
  const asUser = vi.fn(() => ({
    requestJira,
  }));
  const asApp = vi.fn(() => ({
    requestJira,
  }));
  const route = vi.fn((strings: TemplateStringsArray, ...values: any[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
  });

  return {
    default: {
      asUser,
      asApp,
      route,
    },
    asUser,
    asApp,
    route,
  };
});

describe("JiraUserService", () => {
  let jiraUserService: JiraUserService;
  let mockRequestJira: ReturnType<typeof vi.fn>;
  let mockAsUser: ReturnType<typeof vi.fn>;
  let mockAsApp: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    jiraUserService = new JiraUserService();
    // Get mocks from the mocked module
    mockAsUser = vi.mocked(api.asUser);
    mockAsApp = vi.mocked(api.asApp);
    // Get requestJira from the result of asUser() call (they all share the same instance)
    const userMockResult = mockAsUser();
    mockRequestJira = vi.mocked(userMockResult.requestJira);
    vi.clearAllMocks();
  });

  describe("getCurrentUser", () => {
    it("should return current user data when request succeeds", async () => {
      const mockUser: CurrentUser = {
        accountId: "12345",
        emailAddress: "user@example.com",
        displayName: "Test User",
        active: true,
        timeZone: "UTC",
        avatarUrls: {
          "48x48": "https://example.com/avatar48.png",
          "24x24": "https://example.com/avatar24.png",
          "16x16": "https://example.com/avatar16.png",
          "32x32": "https://example.com/avatar32.png",
        },
        locale: "en_US",
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockUser),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(mockAsUser).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/myself");
    });

    it("should return undefined when request fails", async () => {
      const error = new Error("Request failed");
      mockRequestJira.mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await jiraUserService.getCurrentUser();

      expect(result).toBeUndefined();
      expect(mockAsUser).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(error);

      consoleSpy.mockRestore();
    });
  });

  describe("getUserById", () => {
    it("should return user data when request succeeds", async () => {
      const userId = "12345";
      const mockUser: CurrentUser = {
        accountId: userId,
        emailAddress: "user@example.com",
        displayName: "Test User",
        active: true,
        timeZone: "UTC",
        avatarUrls: {
          "48x48": "https://example.com/avatar48.png",
          "24x24": "https://example.com/avatar24.png",
          "16x16": "https://example.com/avatar16.png",
          "32x32": "https://example.com/avatar32.png",
        },
        locale: "en_US",
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockUser),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockAsApp).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledWith(`/rest/api/3/user?accountId=${userId}`);
    });

    it("should return undefined when request fails", async () => {
      const userId = "12345";
      const error = new Error("Request failed");
      mockRequestJira.mockRejectedValue(error);

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await jiraUserService.getUserById(userId);

      expect(result).toBeUndefined();
      expect(mockAsApp).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(error);

      consoleSpy.mockRestore();
    });
  });

  describe("getMyPermissions", () => {
    it("should return permissions when request succeeds", async () => {
      const permissions = ["ADMINISTER", "SYSTEM_ADMIN"];
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {
          ADMINISTER: {
            havePermission: true,
          },
          SYSTEM_ADMIN: {
            havePermission: false,
          },
        },
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.getMyPermissions(permissions);

      expect(result).toEqual(mockPermissionsResponse);
      expect(mockAsUser).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledTimes(1);
      expect(mockRequestJira).toHaveBeenCalledWith(
        "/rest/api/3/mypermissions?permissions=ADMINISTER,SYSTEM_ADMIN",
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
    });

    it("should handle empty permissions array", async () => {
      const permissions: string[] = [];
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {},
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.getMyPermissions(permissions);

      expect(result).toEqual(mockPermissionsResponse);
      expect(mockRequestJira).toHaveBeenCalledWith("/rest/api/3/mypermissions?permissions=", {
        headers: {
          Accept: "application/json",
        },
      });
    });
  });

  describe("isJiraAdmin", () => {
    it("should return true when user has ADMINISTER permission", async () => {
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {
          ADMINISTER: {
            havePermission: true,
          },
          SYSTEM_ADMIN: {
            havePermission: false,
          },
        },
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.isJiraAdmin();

      expect(result).toBe(true);
      expect(mockRequestJira).toHaveBeenCalledWith(
        "/rest/api/3/mypermissions?permissions=ADMINISTER,SYSTEM_ADMIN",
        {
          headers: {
            Accept: "application/json",
          },
        },
      );
    });

    it("should return true when user has SYSTEM_ADMIN permission", async () => {
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {
          ADMINISTER: {
            havePermission: false,
          },
          SYSTEM_ADMIN: {
            havePermission: true,
          },
        },
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.isJiraAdmin();

      expect(result).toBe(true);
    });

    it("should return true when user has both ADMINISTER and SYSTEM_ADMIN permissions", async () => {
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {
          ADMINISTER: {
            havePermission: true,
          },
          SYSTEM_ADMIN: {
            havePermission: true,
          },
        },
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.isJiraAdmin();

      expect(result).toBe(true);
    });

    it("should return false when user has neither ADMINISTER nor SYSTEM_ADMIN permissions", async () => {
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {
          ADMINISTER: {
            havePermission: false,
          },
          SYSTEM_ADMIN: {
            havePermission: false,
          },
        },
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.isJiraAdmin();

      expect(result).toBe(false);
    });

    it("should return false when permissions are missing", async () => {
      const mockPermissionsResponse: GetPermissionsResponse = {
        permissions: {},
      };

      const mockResponse = {
        json: vi.fn().mockResolvedValue(mockPermissionsResponse),
      };
      mockRequestJira.mockResolvedValue(mockResponse);

      const result = await jiraUserService.isJiraAdmin();

      expect(result).toBe(false);
    });
  });
});
