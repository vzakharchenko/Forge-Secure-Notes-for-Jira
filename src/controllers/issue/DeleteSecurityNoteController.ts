import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { Request } from "@forge/resolver";
import { ViewMySecurityNotesList } from "../../../shared/responses/ViewMySecurityNotesList";
import { SecurityNoteId } from "../../../shared/dto/SecurityNoteId";

@resolver
class DeleteSecurityNoteController extends ActualResolver<ViewMySecurityNotesList> {
  functionName(): string {
    return ResolverNames.DELETE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(SecurityNoteId)
  async response(req: Request): Promise<ViewMySecurityNotesList> {
    const payload: SecurityNoteId = req.payload as SecurityNoteId;
    await SECURITY_NOTE_SERVICE.deleteSecurityNote(payload.id);
    return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
  }
}

export default new DeleteSecurityNoteController();
