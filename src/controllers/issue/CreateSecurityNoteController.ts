import { resolver } from "../../core/decorators/ResolverDecorator";
import { ActualResolver } from "../../core/resolver/ActualResolver";
import { ResolverNames } from "../../../shared/ResolverNames";
import { exceptionHandler } from "../../core/decorators/ExceptionHandlerDecorator";
import { SECURITY_NOTE_SERVICE } from "../../core/services/SecurityNoteService";
import { validBodyHandler } from "../../core/decorators/ValidBodyHandlerDecorator";
import { NewSecurityNote } from "../../../shared/dto/NewSecurityNote";
import { Request } from "@forge/resolver";
import { ViewMySecurityNotesList } from "../../../shared/responses/ViewMySecurityNotesList";

@resolver
class CreateSecurityNoteController extends ActualResolver<ViewMySecurityNotesList> {
  functionName(): string {
    return ResolverNames.CREATE_SECURITY_NOTE;
  }

  @exceptionHandler()
  @validBodyHandler(NewSecurityNote)
  async response(req: Request): Promise<ViewMySecurityNotesList> {
    const payload: NewSecurityNote = req.payload as NewSecurityNote;
    await SECURITY_NOTE_SERVICE.createSecurityNote(payload);
    return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
  }
}

export default new CreateSecurityNoteController();
