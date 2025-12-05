import { resolver, exceptionHandler, validBodyHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses";
import { SecurityAccountId } from "../../../shared/dto";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";
@injectable()
@resolver
export class AuditUsersController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.AUDIT_DATA_PER_USER;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityAccountId)
  async response(req: Request<SecurityAccountId>): Promise<AuditUser> {
    const payload: SecurityAccountId = req.payload;
    return {
      result: await this.securityNoteService.getSecurityNoteByAccountId(
        payload.accountId ?? req.context.accountId,
        payload.limit ?? 10,
        payload.offset ?? 0,
      ),
    };
  }
}
