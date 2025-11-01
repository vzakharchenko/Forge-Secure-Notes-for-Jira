import ForgeSQL, {ForgeSqlOperation} from "forge-sql-orm";
import {additionalMetadata} from "./entities";
import {MySqlRemoteDatabase} from "drizzle-orm/mysql-proxy";


export const FORGE_SQL_ORM = new ForgeSQL({additionalMetadata: additionalMetadata,
    logRawSqlQuery: true,
    cacheEntityName: 'cache',
    cacheTTL: 900,
});
