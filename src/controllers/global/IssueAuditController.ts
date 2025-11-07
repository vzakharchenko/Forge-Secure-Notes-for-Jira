import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { IssueIdWithPagination } from "../../../shared/dto/IssueIdWithPagination";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses/AuditUser";

@resolver
class IssueAuditController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_ISSUE;
  }

  @exceptionHandler()
  @validBodyHandler(IssueIdWithPagination)
  async response(req: Request<IssueIdWithPagination>): Promise<AuditUser> {
    const payload: IssueIdWithPagination = req.payload;
    return {
      result: await SECURITY_NOTE_SERVICE.getSecurityNoteByIssue(
        payload.issueId,
        payload.limit,
        payload.offset,
      ),
    };
  }
}

export default new IssueAuditController();
