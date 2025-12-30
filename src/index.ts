import Resolver from "@forge/resolver";

import { fetchSchemaWebTrigger } from "forge-sql-orm";
import { issue, global, admin } from "./resolvers";
import {
  FiveMinutesTrigger as FiveMinuteTrigger,
  SlowQueryTriggerTrigger,
  DropSchemaMigrationTrigger,
  ApplySchemaMigrationTrigger,
} from "./controllers";
import { RovoService, AsyncService, SchedulerTriggerRequest } from "./core";
import { FORGE_INJECTION_TOKENS } from "./constants";
import { JiraUserService } from "./user";
import { AsyncEvent } from "@forge/events";
import { withContainer } from "./core/decorators";
import { decodeJwtPayload } from "./core/utils/cryptoUtils";

const issueResolver = new Resolver();
const globalResolver = new Resolver();
const adminResolver = new Resolver();

issue(issueResolver);
global(globalResolver);
admin(globalResolver);
export const handlerIssue = issueResolver.getDefinitions();
export const handlerGlobal = globalResolver.getDefinitions();
export const handlerAdmin = adminResolver.getDefinitions();

export const handlerFiveMinute = async (request: SchedulerTriggerRequest) =>
  FiveMinuteTrigger.handler(request);

export const runSlowQuery = async () => SlowQueryTriggerTrigger.handler();

export const handlerMigration = async () => ApplySchemaMigrationTrigger.handler();

export const dropMigrations = async () => DropSchemaMigrationTrigger.handler();

export const fetchMigrations = async () => {
  return fetchSchemaWebTrigger();
};

export const runSecurityNotesQuery = withContainer(
  { name: FORGE_INJECTION_TOKENS.RovoServiceImpl, bind: RovoService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
)((rovoContainer, event: any, context: any) => {
  const rovoService: RovoService = rovoContainer.get<RovoService>(
    FORGE_INJECTION_TOKENS.RovoServiceImpl,
  );
  return rovoService.runSecurityNotesQuery(event, context ?? decodeJwtPayload(event.contextToken));
});

export const handlerAsyncDegradation = withContainer(
  { name: FORGE_INJECTION_TOKENS.AsyncService, bind: AsyncService },
  { name: FORGE_INJECTION_TOKENS.JiraUserService, bind: JiraUserService },
)((asyncContainer, event: AsyncEvent) => {
  const asyncService = asyncContainer.get<AsyncService>(FORGE_INJECTION_TOKENS.AsyncService);
  return asyncService.catchDegradation(event);
});
