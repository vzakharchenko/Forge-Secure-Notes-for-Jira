import {Request} from "@forge/resolver";
import {BaseContext} from "../services/ContextTypes";
import {ForgeTypes} from "../../../shared/Types";

export function getTypeFromContext(context: { moduleKey: string }): ForgeTypes {
    switch (context.moduleKey) {
        case "global-page": {
            return ForgeTypes.globalJira;
        }
        case "forge-secure-notes-for-jira": {
            return ForgeTypes.issue;
        }
        case "GDPR-credentials":
        case "expire-credentials": {
            return ForgeTypes.jiraTrigger;
        }
        default: {
            throw new Error("unsupported page for module " + context.moduleKey + ". Please check your manifest");
        }
    }
}

export function getTypeFromRequest(request: Request): ForgeTypes {
    const context = request.context as BaseContext;
    return getTypeFromContext(context);
}
