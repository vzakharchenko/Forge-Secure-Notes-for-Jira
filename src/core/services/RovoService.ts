import { ForgeTypes } from "../../../shared/Types";
import { USER_FACTORY } from "../../user/UserServiceFactory";
import sql from "@forge/sql";
import { Result } from "@forge/sql/out/utils/types";
import { FORGE_SQL_ORM } from "../../database/DbUtils";

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
    event: {
      sql: string;
      context: {
        jira: {
          issueKey: string;
          projectKey: string;
        };
      };
    },
    context: { principal: { accountId: string } },
  ): Promise<Result<unknown>> {
    const query: string = event.sql;
    if (!query || !query.trim()) {
      throw new Error("SQL query is required. Please provide a valid SELECT query.");
    }

    const rawAccountId = context?.principal?.accountId;
    if (!rawAccountId) {
      throw new Error(
        "Authentication error: User account ID is missing. Please ensure you are logged in.",
      );
    }

    const normalizeAccountId = (id: string) => {
      const idx = id.lastIndexOf("/");
      return idx !== -1 ? id.substring(idx + 1) : id;
    };

    const normalizeSqlString = (sql: string): string => {
      return sql
        .replace(/[\n\r\t]+/g, " ")
        .replace(/\s+/g, " ")
        .replace(/\s*;\s*$/, "")
        .trim();
    };

    const currentUserId = normalizeAccountId(rawAccountId);
    let normalized = normalizeSqlString(query.trim());
    const upper = normalized.toUpperCase();

    // Validate query type
    if (!upper.startsWith("SELECT")) {
      throw new Error(
        "Only SELECT queries are allowed. Data modification operations (INSERT, UPDATE, DELETE, etc.) are not permitted.",
      );
    }

    // Validate table name
    if (!upper.includes("FROM SECURITY_NOTES")) {
      throw new Error(
        "Queries must target the 'security_notes' table only. Other tables are not accessible.",
      );
    }

    // Check for aliased security columns (before normalization)
    if (/AS\s+CREATED_BY\b/i.test(normalized) || /AS\s+TARGET_USER_ID\b/i.test(normalized)) {
      throw new Error(
        "Security violation: 'created_by' and 'target_user_id' must be selected as raw columns from the security_notes table. Aliases, constants, or expressions are not allowed for these fields.",
      );
    }

    const isAdmin = await USER_FACTORY.getUserService(ForgeTypes.globalJira).isJiraAdmin();

    // Normalize context variables
    normalized = normalized.replaceAll("ari:cloud:identity::user/", "");
    normalized = normalized.replaceAll(":currentUserId", `'${currentUserId}'`);
    normalized = normalized.replaceAll(
      ":currentProjectKey",
      `'${event.context?.jira?.projectKey || ""}'`,
    );
    normalized = normalized.replaceAll(
      ":currentIssueKey",
      `'${event.context?.jira?.issueKey || ""}'`,
    );

    // Check for JOIN operations using EXPLAIN
    const explainRows = await FORGE_SQL_ORM.analyze().explainRaw(normalized, []);

    const hasJoin = explainRows.some((row) => {
      const info = (row.operatorInfo ?? "").toUpperCase();
      return (
        info.includes("JOIN") ||
        info.includes("CARTESIAN") ||
        info.includes("NESTED LOOP") ||
        info.includes("HASH JOIN")
      );
    });

    if (hasJoin) {
      throw new Error(
        "Security violation: JOIN operations are not allowed. " +
          "For security reasons, Rovo analytics only supports queries over the security_notes table without joins, subqueries, or references to other tables. " +
          "Please rewrite your query to use only the security_notes table.",
      );
    }

    // Detect window functions (e.g., COUNT(*) OVER(...), ROW_NUMBER() OVER(...))
    // Window functions are not allowed for security
    // Users should use regular aggregate functions with GROUP BY instead
    const hasWindow = explainRows.some((row) => {
      const id = row.id.toUpperCase();
      const info = (row.operatorInfo ?? "").toUpperCase();
      return id.includes("WINDOW") || info.includes(" OVER(") || info.includes(" OVER()");
    });

    if (hasWindow) {
      throw new Error(
        "Window functions (for example COUNT(*) OVER(...)) are not allowed in Rovo SQL for this app. " +
          "Please rephrase your question so that it uses regular aggregates instead of window functions.",
      );
    }

    // Apply row-level security for non-admin users
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
    console.debug("Executing Rovo query:", normalized);
    const result = await sql.executeRaw(normalized);

    // Post-execution validation for non-admin users
    if (!isAdmin && result?.metadata?.fields) {
      const fields = result.metadata.fields as Array<{
        name: string;
        schema?: string;
        table?: string;
        orgTable?: string;
      }>;

      const createdByField = fields.find((f) => f.name === "created_by");
      const targetUserField = fields.find((f) => f.name === "target_user_id");

      if (!createdByField || !targetUserField) {
        throw new Error(
          "Security validation failed: The query must include 'created_by' and 'target_user_id' as raw columns in the SELECT statement. These fields are required for row-level security enforcement.",
        );
      }

      const isBadCreatedBy =
        createdByField.orgTable && createdByField.orgTable !== "security_notes";
      const isBadTargetUserId =
        targetUserField.orgTable && targetUserField.orgTable !== "security_notes";

      if (isBadCreatedBy || isBadTargetUserId) {
        throw new Error(
          "Security validation failed: 'created_by' and 'target_user_id' must come directly from the security_notes table. Joins, subqueries, or table aliases that change the origin of these columns are not allowed.",
        );
      }
    }

    return result;
  }
}

export const ROVO_SERVICE: RovoService = new RovoServiceImpl();
