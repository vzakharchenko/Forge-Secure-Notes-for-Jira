import ForgeSQL from "forge-sql-orm";
import { additionalMetadata } from "./entities";

export const FORGE_SQL_ORM = new ForgeSQL({
  additionalMetadata: additionalMetadata,
  logRawSqlQuery: false,
  cacheEntityName: "cache",
  cacheTTL: 900,
  logCache: false,
});
