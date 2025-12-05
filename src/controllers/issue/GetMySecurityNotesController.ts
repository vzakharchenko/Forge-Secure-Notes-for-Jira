import {
  resolver,
  exceptionHandler,
  KVSSchemaMigrationService,
  SecurityNoteService,
} from "../../core";
import { ActualResolver } from "..";
import { ResolverNames } from "../../../shared/ResolverNames";
import { AuditUser } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";

@injectable()
@resolver
export class GetMySecurityNotesController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService)
    private readonly kvsSchemaMigrationService: KVSSchemaMigrationService,
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }
  functionName(): string {
    return ResolverNames.GET_MY_SECURED_NOTES;
  }

  @exceptionHandler()
  async response(): Promise<AuditUser> {
    return { result: await this.securityNoteService.getMySecurityNoteIssue() };
  }
}
