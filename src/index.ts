import Resolver from "@forge/resolver";

import ForgeSQL, {applySchemaMigrations, dropSchemaMigrations, fetchSchemaWebTrigger,} from "forge-sql-orm";
import {additionalMetadata} from "./database/entities";
import migration from "./database/migration";
import issue from "./resolvers/issue";
import global from "./resolvers/global";
import FiveMinuteTrigger from "./controllers/triggers/FiveMinutesTrigger";

const issueResolver = new Resolver();
const globalResolver = new Resolver();
const forgeSQL = new ForgeSQL({ logRawSqlQuery: true, additionalMetadata: additionalMetadata });

const db = forgeSQL.getDrizzleQueryBuilder();

issue(issueResolver)
global(globalResolver)
export const handlerIssue = issueResolver.getDefinitions();
export const handlerGlobal = globalResolver.getDefinitions();

export const handlerFiveMinute =FiveMinuteTrigger.handler

export const handlerMigration = async () => {
  return applySchemaMigrations(migration);
};

export const dropMigrations = () => {
  return dropSchemaMigrations();
};

export const fetchMigrations = () => {
  return fetchSchemaWebTrigger();
};
