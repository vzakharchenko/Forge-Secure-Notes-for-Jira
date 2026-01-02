import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  sendIssueNotification,
  sendExpirationNotification,
  sendNoteDeletedNotification,
} from "../../../../src/core";
import api from "@forge/api";
import * as dateUtils from "../../../../src/core/utils/dateUtils";

vi.mock("@forge/api", async (importOriginal) => {
  const actual = await importOriginal<typeof api>();
  return {
    ...actual,
    default: {
      asApp: vi.fn(),
    },
    route: vi.fn((strings: TemplateStringsArray, ...values: any[]) => {
      return strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
    }),
  };
});

vi.mock("../../../../src/core/utils/dateUtils", () => ({
  formatDateTime: vi.fn(),
}));

describe("sendIssueNotification", () => {
  let mockRequestJira: ReturnType<typeof vi.fn>;
  let mockAsApp: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRequestJira = vi.fn();
    mockAsApp = vi.fn(() => ({
      requestJira: mockRequestJira,
    }));
    vi.mocked(api.asApp).mockImplementation(mockAsApp);
    vi.mocked(dateUtils.formatDateTime).mockReturnValue("January 15, 2024 02:30 PM");
  });

  describe("sendIssueNotification", () => {
    it("should send notification successfully", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendIssueNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
        noteLink: "https://example.com/note",
        displayName: "Test User",
        expiryDate: new Date("2024-01-15T14:30:00Z"),
      });

      expect(mockAsApp).toHaveBeenCalled();
      expect(mockRequestJira).toHaveBeenCalledWith(
        "/rest/api/3/issue/TEST-1/notify",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        }),
      );

      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.subject).toBe("🔐 A security note has been shared with you");
      expect(callBody.to.users[0].accountId).toBe("user-123");
      expect(callBody.htmlBody).toContain("Test User");
      expect(callBody.htmlBody).toContain("https://example.com/note");

      consoleSpy.mockRestore();
    });

    it("should use default displayName when not provided", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendIssueNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
        noteLink: "https://example.com/note",
        expiryDate: new Date("2024-01-15T14:30:00Z"),
      });

      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.htmlBody).toContain("Someone");

      consoleSpy.mockRestore();
    });

    it("should throw error when API request fails", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: vi.fn().mockResolvedValue("Error message"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        sendIssueNotification({
          issueKey: "TEST-1",
          recipientAccountId: "user-123",
          noteLink: "https://example.com/note",
          expiryDate: new Date("2024-01-15T14:30:00Z"),
        }),
      ).rejects.toThrow("Jira API error: 500");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("sendExpirationNotification", () => {
    it("should send expiration notification successfully", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendExpirationNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
        displayName: "Test User",
      });

      expect(mockRequestJira).toHaveBeenCalled();
      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.subject).toBe("⚠️ A Secure Note has expired and was deleted");
      expect(callBody.textBody).toContain("Test User");

      consoleSpy.mockRestore();
    });

    it("should use default displayName when not provided", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendExpirationNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
      });

      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.textBody).toContain("the sender");

      consoleSpy.mockRestore();
    });

    it("should throw error when API request fails", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: vi.fn().mockResolvedValue("Error message"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        sendExpirationNotification({
          issueKey: "TEST-1",
          recipientAccountId: "user-123",
        }),
      ).rejects.toThrow("Jira API error: 404");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("sendNoteDeletedNotification", () => {
    it("should send deletion notification successfully", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendNoteDeletedNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
        displayName: "Test User",
      });

      expect(mockRequestJira).toHaveBeenCalled();
      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.subject).toBe("🗑️ A Secure Note has been deleted");
      expect(callBody.textBody).toContain("Test User");

      consoleSpy.mockRestore();
    });

    it("should use default displayName when not provided", async () => {
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue("Success"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      await sendNoteDeletedNotification({
        issueKey: "TEST-1",
        recipientAccountId: "user-123",
      });

      const callBody = JSON.parse(mockRequestJira.mock.calls[0][1].body);
      expect(callBody.textBody).toContain("the sender");

      consoleSpy.mockRestore();
    });

    it("should throw error when API request fails", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        statusText: "Forbidden",
        text: vi.fn().mockResolvedValue("Error message"),
      };
      mockRequestJira.mockResolvedValue(mockResponse);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      await expect(
        sendNoteDeletedNotification({
          issueKey: "TEST-1",
          recipientAccountId: "user-123",
        }),
      ).rejects.toThrow("Jira API error: 403");

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
