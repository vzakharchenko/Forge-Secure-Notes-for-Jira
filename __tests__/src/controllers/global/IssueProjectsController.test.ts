import { describe, it, expect, vi, beforeEach } from "vitest";
import { IssueProjectsController } from "../../../../src/controllers";
import { SecurityNoteService } from "../../../../src/services";
import { ResolverNames } from "../../../../shared/ResolverNames";
import { ProjectIssue } from "../../../../shared/responses";

describe("IssueProjectsController", () => {
  let controller: IssueProjectsController;
  let mockSecurityNoteService: SecurityNoteService;

  beforeEach(() => {
    mockSecurityNoteService = {
      getIssuesAndProjects: vi.fn(),
    } as unknown as SecurityNoteService;
    controller = new IssueProjectsController(mockSecurityNoteService);
    vi.clearAllMocks();
  });

  describe("functionName", () => {
    it("should return correct resolver name", () => {
      expect(controller.functionName()).toBe(ResolverNames.AUDIT_ISSUES_AND_PROJECTS);
    });
  });

  describe("response", () => {
    it("should call getIssuesAndProjects and return result", async () => {
      const mockResult: ProjectIssue = {
        result: [{ issueId: "1", issueKey: "TEST-1", projectId: "PROJ-1", projectKey: "PROJ" }],
      };
      vi.mocked(mockSecurityNoteService.getIssuesAndProjects).mockResolvedValue(mockResult);

      const result = await controller.response();

      expect(result).toEqual(mockResult);
      expect(mockSecurityNoteService.getIssuesAndProjects).toHaveBeenCalledTimes(1);
    });
  });
});
