import { resolver, exceptionHandler, validBodyHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { ProjectWithPagination } from "../../../shared/dto";
import { AuditUser } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";

@injectable()
@resolver
export class ProjectAuditController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_PROJECT;
  }

  @exceptionHandler()
  @validBodyHandler(ProjectWithPagination)
  async response(req: Request<ProjectWithPagination>): Promise<AuditUser> {
    const payload: ProjectWithPagination = req.payload;
    return {
      result: await this.securityNoteService.getSecurityNoteByProject(
        payload.projectId,
        payload.limit,
        payload.offset,
      ),
    };
  }
}
