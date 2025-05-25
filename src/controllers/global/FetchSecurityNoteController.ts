import {resolver} from "../../core/decorators/ResolverDecorator";
import {ActualResolver} from "../../core/resolver/ActualResolver";
import {ResolverNames} from "../ResolverNames";
import {exceptionHandler} from "../../core/decorators/ExceptionHandlerDecorator";
import {SECURITY_NOTE_SERVICE} from "../../core/services/SecurityNoteService";
import {validBodyHandler} from "../../core/decorators/ValidBodyHandlerDecorator";
import {Request} from "@forge/resolver";
import {SecurityNoteIdAndSecurityHashKey} from "../dto/SecurityNoteIdAndSecurityHashKey";
import {PERMISSION_ERROR_OBJECT, SecurityNoteData} from "../responses/SecurityNoteData";

@resolver
class FetchSecurityNoteController extends ActualResolver<SecurityNoteData> {
    functionName(): string {
        return ResolverNames.FETCH_SECURITY_NOTE;
    }

    @exceptionHandler()
    @validBodyHandler(SecurityNoteIdAndSecurityHashKey)
    async response(req: Request): Promise<SecurityNoteData> {
        const payload:SecurityNoteIdAndSecurityHashKey = req.payload as SecurityNoteIdAndSecurityHashKey;
        const snd = await SECURITY_NOTE_SERVICE.getSecuredData(payload.id, payload.keyHash);
        if (snd){
            return snd
        }
        return PERMISSION_ERROR_OBJECT;
    }
}

export default new FetchSecurityNoteController();
