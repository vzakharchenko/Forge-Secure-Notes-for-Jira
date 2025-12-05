import { resolver, exceptionHandler, validBodyHandler, SecurityNoteService } from "../../core";
import { ResolverNames } from "../../../shared/ResolverNames";
import { Request } from "@forge/resolver";
import { SecurityNoteIdAndSecurityHashKey } from "../../../shared/dto";
import { PERMISSION_ERROR_OBJECT, SecurityNoteData } from "../../../shared/responses";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { ActualResolver } from "..";
@injectable()
@resolver
export class FetchSecurityNoteController extends ActualResolver<SecurityNoteData> {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteService)
    private readonly securityNoteService: SecurityNoteService,
  ) {
    super();
  }
  functionName(): string {
    return ResolverNames.FETCH_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityNoteIdAndSecurityHashKey)
  async response(req: Request): Promise<SecurityNoteData> {
    const payload: SecurityNoteIdAndSecurityHashKey =
      req.payload as SecurityNoteIdAndSecurityHashKey;
    const snd = await this.securityNoteService.getSecuredData(payload.id, payload.keyHash);
    if (snd) {
      return snd;
    }
    return PERMISSION_ERROR_OBJECT;
  }
}
