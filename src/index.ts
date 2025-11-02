import Resolver from "@forge/resolver";

import { fetchSchemaWebTrigger } from "forge-sql-orm";
import issue from "./resolvers/issue";
import global from "./resolvers/global";
import FiveMinuteTrigger from "./controllers/triggers/FiveMinutesTrigger";
import SlowQueryTriggerTrigger from "./controllers/triggers/SlowQueryTriggerTrigger";
import DropSchemaMigrationTrigger from "./controllers/triggers/DropSchemaMigrationTrigger";
import ApplySchemaMigrationTrigger from "./controllers/triggers/ApplySchemaMigrationTrigger";

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
