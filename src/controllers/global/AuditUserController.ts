import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses/AuditUser";
import { SecurityAccountId } from "../../../shared/dto/SecurityAccountId";

@resolver
class AuditUsersController extends ActualResolver<AuditUser> {
  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_USER;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityAccountId)
  async response(req: Request<SecurityAccountId>): Promise<AuditUser> {
    const payload: SecurityAccountId = req.payload;
    return {
      result: await SECURITY_NOTE_SERVICE.getSecurityNoteByAccountId(
        payload.accountId ?? req.context.accountId,
        payload.limit ?? 10,
        payload.offset ?? 0,
      ),
    };
  }
}

export default new AuditUsersController();
