import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { AuditUser } from "../../../shared/responses/AuditUser";

@resolver
class GetMySecurityNotesController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.GET_MY_SECURED_NOTES;
  }

  @exceptionHandler()
  async response(): Promise<AuditUser> {
    return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
  }
}

export default new GetMySecurityNotesController();
