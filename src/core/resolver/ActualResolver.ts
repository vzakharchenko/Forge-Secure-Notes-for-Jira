import "reflect-metadata";
import Resolver, {Request} from "@forge/resolver";
import {ErrorResponse, ForgeTypes} from "../Types";
import {getTypeFromRequest} from "../utils/forgeUtils";
import {BaseContext} from "../services/ContextTypes";
import {applicationContext} from "../../controllers/ApplicationContext";

export abstract class ActualResolver<T extends ErrorResponse> {
    abstract functionName(): string;
    abstract response(req: Request): Promise<T>;

    getForgeModuleType(req: Request): ForgeTypes {
        return getTypeFromRequest(req);
    }

    getAccountId(req: Request): string {
        const context = req.context as BaseContext;
        return context.accountId;
    }

    register(resolver: Resolver): void {
        resolver.define(this.functionName(), async (req: Request) => {
            return applicationContext.run(
                { accountId: req.context.accountId },
                async () => {
                    return this.response(req);
                },
            );
        });
    }
}
