import { ForgeTypes } from "../../../shared/Types";
import { USER_FACTORY } from "../../user/UserServiceFactory";
import sql from "@forge/sql";
import { Result } from "@forge/sql/out/utils/types";

export interface RovoService {
  runSecurityNotesQuery(
    event: { sql: string },
    context: {
      principal: { accountId: string };
    },
  ): Promise<Result<unknown>>;
}

class RovoServiceImpl implements RovoService {
  async runSecurityNotesQuery(
    event: { sql: string },
    context: { principal: { accountId: string } },
  ): Promise<Result<unknown>> {
    const query: string = event.sql;
    if (!query) {
      throw new Error("Missing SQL query in payload");
    }

    const rawAccountId = context?.principal?.accountId;
    if (!rawAccountId) {
      throw new Error("Missing principal accountId in context");
    }
    const normalizeAccountId = (id: string) => {
      const idx = id.lastIndexOf("/");
      return idx !== -1 ? id.substring(idx + 1) : id;
    };
    const currentUserId = normalizeAccountId(rawAccountId);
    let normalized = query.trim();
    const upper = normalized.toUpperCase();

    if (!upper.startsWith("SELECT")) {
      throw new Error("Only SELECT queries are allowed");
    }

    if (!upper.includes("FROM SECURITY_NOTES")) {
      throw new Error("Only queries against the security_notes table are allowed");
    }
    const isAdmin = await USER_FACTORY.getUserService(ForgeTypes.globalJira).isJiraAdmin();
    normalized = query.replaceAll("ari:cloud:identity::user/", "");
    if (!isAdmin) {
      if (normalized.endsWith(";")) {
        normalized = normalized.slice(0, -1);
      }

      normalized = `
            SELECT *
            FROM (
                     ${normalized}
                     ) AS t
            WHERE (t.created_by = '${currentUserId}' OR t.target_user_id = '${currentUserId}')
        `;
    }
    // eslint-disable-next-line no-console
    console.debug(normalized);
    return await sql.executeRaw(normalized);
  }
}

export const ROVO_SERVICE: RovoService = new RovoServiceImpl();
