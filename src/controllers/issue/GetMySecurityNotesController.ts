import {resolver} from "../../core/decorators/ResolverDecorator";
import {ActualResolver} from "../../core/resolver/ActualResolver";
import {ResolverNames} from "../../../shared/ResolverNames";
import {exceptionHandler} from "../../core/decorators/ExceptionHandlerDecorator";
import {ViewMySecurityNotesList} from "../../../shared/responses/ViewMySecurityNotesList";
import {SECURITY_NOTE_SERVICE} from "../../core/services/SecurityNoteService";

@resolver
class GetMySecurityNotesController extends ActualResolver<ViewMySecurityNotesList> {
    functionName(): string {
        return ResolverNames.GET_MY_SECURED_NOTES;
    }

    @exceptionHandler()
    async response(): Promise<ViewMySecurityNotesList> {
        return { result: await SECURITY_NOTE_SERVICE.getMySecurityNoteIssue() };
    }
}

export default new GetMySecurityNotesController();
