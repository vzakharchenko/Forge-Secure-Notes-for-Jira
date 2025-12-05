import {
  resolver,
  exceptionHandler,
  validBodyHandler,
  isIssueContext,
  IssueContext,
  SecurityNoteService,
} from "../../core";
import { ActualResolver } from "..";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteId } from "../../../shared/dto";
import { AuditUser } from "../../../shared/responses";
import { publishGlobal } from "@forge/realtime";
import { SHARED_EVENT_NAME } from "../../../shared/Types";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { getAppContext } from "../../controllers";

@injectable()
@resolver
export class DeleteSecurityNoteController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.DELETE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityNoteId)
  async response(req: Request): Promise<AuditUser> {
    const { context } = getAppContext()!;
    if (!isIssueContext(context)) {
      throw new Error("expected Issue context");
    }
    const issueId = (context as IssueContext).extension.issue.id;
    const payload: SecurityNoteId = req.payload as SecurityNoteId;
    await this.securityNoteService.deleteSecurityNote(payload.id);
    await publishGlobal(SHARED_EVENT_NAME, issueId);
    return { result: await this.securityNoteService.getMySecurityNoteIssue() };
  }
}
