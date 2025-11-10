import { publishGlobal } from "@forge/realtime";
import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { NewSecurityNote } from "../../../shared/dto/NewSecurityNote";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses/AuditUser";
import { applicationContext } from "../ApplicationContext";
import { isIssueContext, IssueContext } from "../../core/services/ContextTypes";
import { SHARED_EVENT_NAME } from "../../../shared/Types";

@resolver
class CreateSecurityNoteController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.CREATE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(NewSecurityNote)
  async response(req: Request<NewSecurityNote>): Promise<AuditUser> {
    const { context } = applicationContext.getStore()!;
    if (!isIssueContext(context)) {
      throw new Error("expected Issue context");
    }
    const issueId = (context as IssueContext).extension.issue.id;
    const payload: NewSecurityNote = req.payload;
    await SECURITY_NOTE_SERVICE.createSecurityNote(payload);

    await publishGlobal(SHARED_EVENT_NAME, issueId);
    return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
  }
}

export default new CreateSecurityNoteController();
