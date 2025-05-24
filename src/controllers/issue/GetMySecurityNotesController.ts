import {Request} from "@forge/resolver";
import {resolver} from "../../core/decorators/ResolverDecorator";
import {ActualResolver} from "../../core/resolver/ActualResolver";
import {ResolverNames} from "../ResolverNames";
import {exceptionHandler} from "../../core/decorators/ExceptionHandlerDecorator";
import {CONTEXT_SERVICE} from "../../core/services/contextService";
import {IssueActivityContext} from "../../core/services/ContextTypes";
import {USER_FACTORY} from "../../user/UserServiceFactory";
import {ViewMySecurityNotesList} from "../responses/ViewMySecurityNotesList";

@resolver
class GetMySecurityNotesController extends ActualResolver<ViewMySecurityNotesList> {
    functionName(): string {
        return ResolverNames.GET_MY_SECURED_NOTES;
    }

    @exceptionHandler()
    async response(request: Request): Promise<ViewMySecurityNotesList> {
        const time = new Date().getTime();
        const type = this.getForgeModuleType(request);
        const issueContext = CONTEXT_SERVICE.getContext<IssueActivityContext>(request);
        const issueKey = issueContext.extension.issue.key;
        const currentUser = await USER_FACTORY.getUserService(type).getCurrentUser();
        const accountId = currentUser.accountId;
        return { result:[] };
    }
}

export default new GetMySecurityNotesController();
