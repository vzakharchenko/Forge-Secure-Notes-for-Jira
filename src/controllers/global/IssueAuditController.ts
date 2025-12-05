import { resolver, exceptionHandler, validBodyHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { IssueIdWithPagination } from "../../../shared/dto";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";

@injectable()
@resolver
export class IssueAuditController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_ISSUE;
  }

  @exceptionHandler()
  @validBodyHandler(IssueIdWithPagination)
  async response(req: Request<IssueIdWithPagination>): Promise<AuditUser> {
    const payload: IssueIdWithPagination = req.payload;
    return {
      result: await this.securityNoteService.getSecurityNoteByIssue(
        payload.issueId,
        payload.limit,
        payload.offset,
      ),
    };
  }
}
