import "reflect-metadata";
import Resolver, { Request } from "@forge/resolver";
import { ErrorResponse, ForgeTypes } from "../../../shared/Types";
import { getTypeFromRequest } from "../utils/forgeUtils";
import { applicationContext } from "../../controllers/ApplicationContext";
import { CONTEXT_SERVICE } from "../services/contextService";
import { FORGE_SQL_ORM } from "../../database/DbUtils";
import { KVS_SCHEMA_MIGRATION_SERVICE } from "../services/KVSSchemaMigrationService";
import ApplySchemaMigrationTrigger from "../../controllers/triggers/ApplySchemaMigrationTrigger";

export abstract class ActualResolver<T extends ErrorResponse> {
  abstract functionName(): string;
  abstract response(req: Request): Promise<T>;

  getForgeModuleType(req: Request): ForgeTypes {
    return getTypeFromRequest(req);
  }

  register(resolver: Resolver): void {
    resolver.define(this.functionName(), async (req: Request) => {
      return FORGE_SQL_ORM.executeWithMetadata(
        async () => {
          const forgeModuleType = this.getForgeModuleType(req);
          const context = CONTEXT_SERVICE.getContext(req);
          if (!(await KVS_SCHEMA_MIGRATION_SERVICE.isLatestVersion())) {
            try {
              await ApplySchemaMigrationTrigger.handler();
            } catch (e: any) {
              // eslint-disable-next-line no-console
              console.error(e.message, e);
              return {
                isError: true,
                errorType: "INSTALLATION",
                message: "Please wait, installation in progress",
              };
            }
          }
          return applicationContext.run(
            { accountId: req.context.accountId, forgeType: forgeModuleType, context },
            async () => {
              return this.response(req);
            },
          );
        },
        async (totalDbExecutionTime, totalResponseSize, printQueriesWithPlan) => {
          let resolverName = this.functionName();
          if (totalDbExecutionTime > 2000) {
            // eslint-disable-next-line no-console
            console.warn(
              `Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`,
            );
            await printQueriesWithPlan();
          } else if (totalDbExecutionTime > 1000) {
            // eslint-disable-next-line no-console
            console.debug(
              `Resolver ${resolverName} has high database execution time: ${totalDbExecutionTime}ms`,
            );
          }
        },
      );
    });
  }
}
