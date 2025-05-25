import {resolver} from "../../core/decorators/ResolverDecorator";
import {ActualResolver} from "../../core/resolver/ActualResolver";
import {ResolverNames} from "../ResolverNames";
import {exceptionHandler} from "../../core/decorators/ExceptionHandlerDecorator";
import {SECURITY_NOTE_SERVICE} from "../../core/services/SecurityNoteService";
import {validBodyHandler} from "../../core/decorators/ValidBodyHandlerDecorator";
import {Request} from "@forge/resolver";
import {SecurityNoteId} from "../dto/SecurityNoteId";
import {OpenSecurityNote} from "../responses/OpenSecurityNote";

@resolver
class OpenSecurityNoteController extends ActualResolver<OpenSecurityNote> {
    functionName(): string {
        return ResolverNames.OPEN_LINK_SECURITY_NOTE;
    }

    @exceptionHandler()
    @validBodyHandler(SecurityNoteId)
    async response(req: Request): Promise<OpenSecurityNote> {
        const payload:SecurityNoteId = req.payload as SecurityNoteId;
        return {valid: await SECURITY_NOTE_SERVICE.isValidLink(payload.id)}
    }
}

export default new OpenSecurityNoteController();
