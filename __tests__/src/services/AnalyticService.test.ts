import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AnalyticService } from "../../../src/services";
import { fetch, getAppContext } from "@forge/api";

vi.mock("@forge/api", () => ({
  fetch: vi.fn(),
  getAppContext: vi.fn(),
}));

describe("AnalyticService", () => {
  let service: AnalyticService;
  const mockFetch = vi.mocked(fetch);
  const mockGetAppContext = vi.mocked(getAppContext);

  beforeEach(() => {
    service = new AnalyticService();
    vi.clearAllMocks();
    process.env.ANALYTICS_API_KEY = "test-api-key";
  });

  afterEach(() => {
    delete process.env.ANALYTICS_API_KEY;
  });

  describe("parseVersion", () => {
    it("should remove non-numeric characters from version string", () => {
      expect(service.parseVersion("1.2.3")).toBe("123");
      expect(service.parseVersion("v1.2.3-alpha")).toBe("123");
      expect(service.parseVersion("2.0.0-beta.1")).toBe("2001");
    });

    it("should return empty string for non-numeric input", () => {
      expect(service.parseVersion("abc")).toBe("");
    });
  });

  describe("sendAnalytics", () => {
    it("should send analytics when ANALYTICS_API_KEY is set", async () => {
      const mockContext = {
        environmentType: "production",
        environmentAri: { environmentId: "env-123" },
        appVersion: "1.2.3",
      };
      mockGetAppContext.mockReturnValue(mockContext as any);
      mockFetch.mockResolvedValue({} as any);

      await service.sendAnalytics("test-event", "test-resolver", "cloud-123", {
        totalDbExecutionTime: 100,
        totalResponseSize: 500,
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("https://eu.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("test-event"),
      });

      const callArgs = mockFetch.mock.calls[0][1];
      const body = JSON.parse(callArgs?.body as string);
      expect(body.api_key).toBe("test-api-key");
      expect(body.event).toBe("test-event");
      expect(body.distinct_id).toBe("cloud-123");
      expect(body.properties.resolverName).toBe("test-resolver");
      expect(body.properties.parsedVersion).toBe("123");
    });

    it("should not send analytics when ANALYTICS_API_KEY is not set", async () => {
      delete process.env.ANALYTICS_API_KEY;

      await service.sendAnalytics("test-event", "test-resolver", "cloud-123", {
        totalDbExecutionTime: 100,
        totalResponseSize: 500,
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
