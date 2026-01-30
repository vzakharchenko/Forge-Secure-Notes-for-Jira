import { resolver, exceptionHandler, validBodyHandler } from "../../core";
import { SecurityNoteService } from "../../services";
import { ActualResolver } from "..";
import { ResolverNames } from "../../../shared/ResolverNames";
import { NewCustomAppSecurityNote, NewSecurityNote } from "../../../shared/dto";
import { Request } from "@forge/resolver";
import { AuditUser } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";

@injectable()
@resolver
export class CreateAppSecurityNoteController extends ActualResolver<AuditUser> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }

  functionName(): string {
    return ResolverNames.CREATE_CUSTOM_APP_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(NewCustomAppSecurityNote)
  async response(req: Request<NewCustomAppSecurityNote>): Promise<AuditUser> {
    const payload: NewCustomAppSecurityNote = req.payload;
    const viewMySecurityNotes = await this.securityNoteService.createCustomAppSecurityNote(payload);
    return { result: viewMySecurityNotes };
  }
}
