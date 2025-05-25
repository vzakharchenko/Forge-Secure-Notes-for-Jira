import "reflect-metadata";
import Resolver, {Request} from "@forge/resolver";
import {ErrorResponse, ForgeTypes} from "../Types";
import {getTypeFromRequest} from "../utils/forgeUtils";
import {applicationContext} from "../../controllers/ApplicationContext";
import {CONTEXT_SERVICE} from "../services/contextService";

export abstract class ActualResolver<T extends ErrorResponse> {
    abstract functionName(): string;
    abstract response(req: Request): Promise<T>;

    getForgeModuleType(req: Request): ForgeTypes {
        return getTypeFromRequest(req);
    }

    register(resolver: Resolver): void {
        resolver.define(this.functionName(), async (req: Request) => {
            const forgeModuleType = this.getForgeModuleType(req);
            const context = CONTEXT_SERVICE.getContext(req);
            return applicationContext.run(
                { accountId: req.context.accountId, forgeType: forgeModuleType, context },
                async () => {
                    return this.response(req);
                },
            );
        });
    }
}
