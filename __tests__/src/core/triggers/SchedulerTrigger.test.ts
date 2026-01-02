import { describe, it, expect } from "vitest";
import {
  getHttpResponse,
  SchedulerTrigger,
  SchedulerTriggerRequest,
  SchedulerTriggerResponse,
  SchedulerTriggerContext,
} from "../../../../src/core";

describe("SchedulerTrigger", () => {
  describe("getHttpResponse", () => {
    it("should return response with status 200 and 'Ok' statusText", () => {
      const body = { message: "Success" };

      const result = getHttpResponse(200, body);

      expect(result.statusCode).toBe(200);
      expect(result.statusText).toBe("Ok");
      expect(result.body).toEqual(body);
      expect(result.headers).toEqual({ "Content-Type": ["application/json"] });
    });

    it("should return response with status 404 and 'Not Found' statusText", () => {
      const body = { error: "Not found" };

      const result = getHttpResponse(404, body);

      expect(result.statusCode).toBe(404);
      expect(result.statusText).toBe("Not Found");
      expect(result.body).toEqual(body);
      expect(result.headers).toEqual({ "Content-Type": ["application/json"] });
    });

    it("should return response with status 400 and 'Bad Request' statusText", () => {
      const body = { error: "Bad request" };

      const result = getHttpResponse(400, body);

      expect(result.statusCode).toBe(400);
      expect(result.statusText).toBe("Bad Request");
      expect(result.body).toEqual(body);
      expect(result.headers).toEqual({ "Content-Type": ["application/json"] });
    });

    it("should return response with status 500 and 'Bad Request' statusText", () => {
      const body = { error: "Internal server error" };

      const result = getHttpResponse(500, body);

      expect(result.statusCode).toBe(500);
      expect(result.statusText).toBe("Bad Request");
      expect(result.body).toEqual(body);
      expect(result.headers).toEqual({ "Content-Type": ["application/json"] });
    });

    it("should return response with string body", () => {
      const body = "Simple string response";

      const result = getHttpResponse(200, body);

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe(body);
    });

    it("should return response with number body", () => {
      const body = 42;

      const result = getHttpResponse(200, body);

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe(body);
    });

    it("should return response with null body", () => {
      const body = null;

      const result = getHttpResponse(200, body);

      expect(result.statusCode).toBe(200);
      expect(result.body).toBeNull();
    });

    it("should return response with array body", () => {
      const body = [1, 2, 3];

      const result = getHttpResponse(200, body);

      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(body);
    });
  });

  describe("SchedulerTrigger abstract class", () => {
    it("should be an abstract class that can be extended", () => {
      class ConcreteSchedulerTrigger extends SchedulerTrigger {
        async handler(): Promise<SchedulerTriggerResponse<string>> {
          return getHttpResponse(200, "Success");
        }
      }

      const instance = new ConcreteSchedulerTrigger();
      expect(instance).toBeInstanceOf(SchedulerTrigger);
      expect(instance).toBeInstanceOf(ConcreteSchedulerTrigger);
    });

    it("should require handler method implementation", async () => {
      class ConcreteSchedulerTrigger extends SchedulerTrigger {
        async handler(): Promise<SchedulerTriggerResponse<string>> {
          return getHttpResponse(200, "Handler executed");
        }
      }

      const instance = new ConcreteSchedulerTrigger();
      const mockRequest: SchedulerTriggerRequest = {
        context: {
          cloudId: "cloud-123",
          moduleKey: "module-key",
        },
        userAccess: {
          enabled: true,
        },
        contextToken: "token-123",
      };
      const mockContext: SchedulerTriggerContext = {
        installContext: "context-123",
      };

      const result = await instance.handler(mockRequest, mockContext);

      expect(result.statusCode).toBe(200);
      expect(result.body).toBe("Handler executed");
    });
  });

  describe("Type definitions", () => {
    it("should have correct SchedulerTriggerRequest structure", () => {
      const request: SchedulerTriggerRequest = {
        context: {
          cloudId: "cloud-123",
          moduleKey: "module-key",
        },
        userAccess: {
          enabled: true,
        },
        contextToken: "token-123",
      };

      expect(request.context.cloudId).toBe("cloud-123");
      expect(request.context.moduleKey).toBe("module-key");
      expect(request.userAccess.enabled).toBe(true);
      expect(request.contextToken).toBe("token-123");
    });

    it("should have correct SchedulerTriggerContext structure", () => {
      const context: SchedulerTriggerContext = {
        installContext: "context-123",
        installation: {
          ari: {
            installationId: "install-123",
          },
          contexts: [
            {
              cloudId: "cloud-123",
              workspaceId: "workspace-123",
            },
          ],
        },
      };

      expect(context.installContext).toBe("context-123");
      expect(context.installation?.ari.installationId).toBe("install-123");
      expect(context.installation?.contexts[0].cloudId).toBe("cloud-123");
    });

    it("should have correct SchedulerTriggerResponse structure", () => {
      const response: SchedulerTriggerResponse<string> = {
        statusCode: 200,
        statusText: "Ok",
        body: "Response body",
        headers: {
          "Content-Type": ["application/json"],
        },
      };

      expect(response.statusCode).toBe(200);
      expect(response.statusText).toBe("Ok");
      expect(response.body).toBe("Response body");
      expect(response.headers).toBeDefined();
    });
  });
});
