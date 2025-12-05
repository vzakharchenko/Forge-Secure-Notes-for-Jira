import { publishGlobal } from "@forge/realtime";
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
import { NewSecurityNote } from "../../../shared/dto";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses";
import { getAppContext } from "../../controllers";
import { SHARED_EVENT_NAME } from "../../../shared/Types";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";

@injectable()
@resolver
export class CreateSecurityNoteController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.CREATE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(NewSecurityNote)
  async response(req: Request<NewSecurityNote>): Promise<AuditUser> {
    const { context } = getAppContext()!;
    if (!isIssueContext(context)) {
      throw new Error("expected Issue context");
    }
    const issueId = (context as IssueContext).extension.issue.id;
    const payload: NewSecurityNote = req.payload;
    await this.securityNoteService.createSecurityNote(payload);

    await publishGlobal(SHARED_EVENT_NAME, issueId);
    return { result: await this.securityNoteService.getMySecurityNoteIssue() };
  }
}
