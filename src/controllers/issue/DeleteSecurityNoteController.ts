import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { Request } from "@forge/resolver";
import { SecurityNoteId } from "../../../shared/dto/SecurityNoteId";
import { AuditUser } from "../../../shared/responses/AuditUser";
import { publishGlobal } from "@forge/realtime";
import { applicationContext } from "../ApplicationContext";
import { isIssueContext, IssueContext } from "../../core/services/ContextTypes";
import { SHARED_EVENT_NAME } from "../../../shared/Types";

@resolver
class DeleteSecurityNoteController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.DELETE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityNoteId)
  async response(req: Request): Promise<AuditUser> {
    const { context } = applicationContext.getStore()!;
    if (!isIssueContext(context)) {
      throw new Error("expected Issue context");
    }
    const issueId = (context as IssueContext).extension.issue.id;
    const payload: SecurityNoteId = req.payload as SecurityNoteId;
    await SECURITY_NOTE_SERVICE.deleteSecurityNote(payload.id);
    await publishGlobal(SHARED_EVENT_NAME, issueId);
    return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
  }
}

export default new DeleteSecurityNoteController();
