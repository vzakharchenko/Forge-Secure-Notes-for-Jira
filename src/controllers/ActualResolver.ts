import "reflect-metadata";
import Resolver, { Request } from "@forge/resolver";
import { ErrorResponse } from "../../shared/Types";
import { applicationContext } from ".";
import { ContextService, KVSSchemaMigrationService, AnalyticService } from "../core";
import { FORGE_SQL_ORM } from "../database";
import { Container } from "inversify";
import { ApplySchemaMigrationTrigger } from ".";
import { FORGE_INJECTION_TOKENS } from "../constants";

export abstract class ActualResolver<T extends ErrorResponse> {
  abstract functionName(): string;
  abstract response(req: Request): Promise<T>;

  register(resolver: Resolver, container: Container): void {
    resolver.define(this.functionName(), async (req: Request) => {
      const resolverName = this.functionName();
      const context = container
        .get<ContextService>(FORGE_INJECTION_TOKENS.ContextService)
        .getContext(req);
      const kvsSchemaMigrationService: KVSSchemaMigrationService =
        container.get<KVSSchemaMigrationService>(FORGE_INJECTION_TOKENS.KVSSchemaMigrationService);
      const analyticService: AnalyticService = container.get<AnalyticService>(
        FORGE_INJECTION_TOKENS.AnalyticService,
      );
      return applicationContext.run({ accountId: req.context.accountId, context }, async () => {
        return FORGE_SQL_ORM.executeWithMetadata(
          async () => {
            if (!(await kvsSchemaMigrationService.isLatestVersion())) {
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
            return this.response(req);
          },
          async (totalDbExecutionTime, totalResponseSize, printQueriesWithPlan) => {
            await analyticService.sendAnalytics(
              "sql_resolver_performance",
              resolverName,
              context.cloudId,
              { totalDbExecutionTime, totalResponseSize },
            );
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
          { asyncQueueName: "degradationQueue" },
        );
      });
    });
  }
}
