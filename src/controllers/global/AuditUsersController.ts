import { resolver, exceptionHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { AuditUsers } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";
@injectable()
@resolver
export class AuditUsersController extends ActualResolver<AuditUsers> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.AUDIT_USERS_ALL;
  }

  @exceptionHandler()
  async response(): Promise<AuditUsers> {
    return { result: await this.securityNoteService.getSecurityNoteUsers() };
  }
}
