import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { AuditUsers } from "../../../shared/responses/AuditUsers";
import { ProjectIssue } from "../../../shared/responses/ProjectIssue";

@resolver
class IssueProjectsController extends ActualResolver<ProjectIssue> {
  functionName(): string {
    return ResolverNames.AUDIT_ISSUES_AND_PROJECTS;
  }

  @exceptionHandler()
  async response(): Promise<ProjectIssue> {
    return await SECURITY_NOTE_SERVICE.getIssuesAndProjects();
  }
}

export default new IssueProjectsController();
