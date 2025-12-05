import Resolver from "@forge/resolver";

import { fetchSchemaWebTrigger } from "forge-sql-orm";
import { issue } from "./resolvers";
import { global } from "./resolvers";
import {
  FiveMinutesTrigger as FiveMinuteTrigger,
  SlowQueryTriggerTrigger,
  DropSchemaMigrationTrigger,
  ApplySchemaMigrationTrigger,
} from "./controllers";
import { RovoService } from "./core";
import { Container } from "inversify";
import { FORGE_INJECTION_TOKENS } from "./constants";
import { JiraUserService } from "./user";

const issueResolver = new Resolver();
const globalResolver = new Resolver();

issue(issueResolver);
global(globalResolver);
export const handlerIssue = issueResolver.getDefinitions();
export const handlerGlobal = globalResolver.getDefinitions();

export const handlerFiveMinute = FiveMinuteTrigger.handler;

export const runSlowQuery = SlowQueryTriggerTrigger.handler;

export const handlerMigration = ApplySchemaMigrationTrigger.handler;

export const dropMigrations = DropSchemaMigrationTrigger.handler;

export const fetchMigrations = async () => {
  return fetchSchemaWebTrigger();
};

export const runSecurityNotesQuery = (event: any, context: any) => {
  const rovoContainer = new Container();
  rovoContainer.bind(FORGE_INJECTION_TOKENS.JiraUserService).to(JiraUserService);
  rovoContainer.bind(FORGE_INJECTION_TOKENS.RovoServiceImpl).to(RovoService);
  const rovoService = rovoContainer.get<RovoService>(FORGE_INJECTION_TOKENS.RovoServiceImpl);
  return rovoService.runSecurityNotesQuery(event, context);
};
