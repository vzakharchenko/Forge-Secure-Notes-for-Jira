import Resolver from "@forge/resolver";

import ForgeSQL, {applySchemaMigrations, dropSchemaMigrations, fetchSchemaWebTrigger,} from "forge-sql-orm";
import {additionalMetadata} from "./database/entities";
import migration from "./database/migration";
import issue from "./resolvers/issue";

const issueResolver = new Resolver();
const forgeSQL = new ForgeSQL({ logRawSqlQuery: true, additionalMetadata: additionalMetadata });

const db = forgeSQL.getDrizzleQueryBuilder();

issue(issueResolver)
export const handlerIssue = issueResolver.getDefinitions();

export const handlerMigration = async () => {
  return applySchemaMigrations(migration);
};

export const dropMigrations = () => {
  return dropSchemaMigrations();
};

export const fetchMigrations = () => {
  return fetchSchemaWebTrigger();
};
