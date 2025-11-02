import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { IssueIdWithPagination } from "../../../shared/dto/IssueIdWithPagination";
import { Request } from "@forge/resolver";
import { ViewMySecurityNotesList } from "../../../shared/responses/ViewMySecurityNotesList";

@resolver
class IssueAuditController extends ActualResolver<ViewMySecurityNotesList> {
  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_ISSUE;
  }

  @exceptionHandler()
  @validBodyHandler(IssueIdWithPagination)
  async response(req: Request<IssueIdWithPagination>): Promise<ViewMySecurityNotesList> {
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
