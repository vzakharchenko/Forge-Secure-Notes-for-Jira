import "reflect-metadata";
import Resolver, {Request} from "@forge/resolver";
import {ErrorResponse, ForgeTypes} from "../Types";
import {getTypeFromRequest} from "../utils/forgeUtils";
import {applicationContext} from "../../controllers/ApplicationContext";
import {CONTEXT_SERVICE} from "../services/contextService";
import {FORGE_SQL_ORM} from "../../database/DbUtils";

export abstract class ActualResolver<T extends ErrorResponse> {
    abstract functionName(): string;
    abstract response(req: Request): Promise<T>;

    getForgeModuleType(req: Request): ForgeTypes {
        return getTypeFromRequest(req);
    }

    register(resolver: Resolver): void {
        resolver.define(this.functionName(), async (req: Request) => {
           return FORGE_SQL_ORM.executeWithMetadata(async ()=>{
                const forgeModuleType = this.getForgeModuleType(req);
                const context = CONTEXT_SERVICE.getContext(req);
                return applicationContext.run(
                    { accountId: req.context.accountId, forgeType: forgeModuleType, context },
                    async () => {
                        return this.response(req);
                    },
                );
            },
                async (totalDbExecutionTime, totalResponseSize, printQueriesWithPlan)=>{
                    let resolverName = this.functionName();
                    if (totalDbExecutionTime>800) {
                       console.warn(`Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`)
                       await printQueriesWithPlan();
                   } else if (totalDbExecutionTime>300) {
                       console.debug(`Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`)
                   }
                })

        });
    }
}
