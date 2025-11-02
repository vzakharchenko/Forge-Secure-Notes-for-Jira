import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { AuditUsers } from "../../../shared/responses/AuditUsers";

@resolver
class AuditUsersController extends ActualResolver<AuditUsers> {
  functionName(): string {
    return ResolverNames.AUDIT_USERS_ALL;
  }

  @exceptionHandler()
  async response(): Promise<AuditUsers> {
    return { result: await SECURITY_NOTE_SERVICE.getSecurityNoteUsers() };
  }
}

export default new AuditUsersController();
