import { resolver, exceptionHandler, validBodyHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteId } from "../../../shared/dto";
import { OpenSecurityNote } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";

@injectable()
@resolver
export class OpenSecurityNoteController extends ActualResolver<OpenSecurityNote> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.OPEN_LINK_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityNoteId)
  async response(req: Request): Promise<OpenSecurityNote> {
    const payload: SecurityNoteId = req.payload as SecurityNoteId;
    return await this.securityNoteService.isValidLink(payload.id);
  }
}
