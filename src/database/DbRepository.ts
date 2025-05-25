import ForgeSQL, {ForgeSqlOperation} from "forge-sql-orm";
import {additionalMetadata} from "./entities";
import {MySqlRemoteDatabase} from "drizzle-orm/mysql-proxy";


const forgeSQL = new ForgeSQL({additionalMetadata: additionalMetadata, logRawSqlQuery: true});

export class DbRepository {
    getForgeSql(): ForgeSqlOperation {
        return forgeSQL;
    }

    getDb():MySqlRemoteDatabase<Record<string, unknown>> {
        return this.getForgeSql().getDrizzleQueryBuilder();
    }
}
