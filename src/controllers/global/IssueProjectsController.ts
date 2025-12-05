import { resolver, exceptionHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { ProjectIssue } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";

@injectable()
@resolver
export class IssueProjectsController extends ActualResolver<ProjectIssue> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.AUDIT_ISSUES_AND_PROJECTS;
  }

  @exceptionHandler()
  async response(): Promise<ProjectIssue> {
    return await this.securityNoteService.getIssuesAndProjects();
  }
}
