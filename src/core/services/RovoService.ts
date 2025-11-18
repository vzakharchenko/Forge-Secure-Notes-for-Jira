import { ForgeTypes } from "../../../shared/Types";
import { USER_FACTORY } from "../../user/UserServiceFactory";
import sql from "@forge/sql";
import { Result } from "@forge/sql/out/utils/types";
import { FORGE_SQL_ORM } from "../../database/DbUtils";
import { Parser, Select } from "node-sql-parser";

export interface RovoService {
  runSecurityNotesQuery(
    event: { sql: string },
    context: {
      principal: { accountId: string };
    },
  ): Promise<Result<unknown>>;
}

class RovoServiceImpl implements RovoService {
  /**
   * Parses SQL query into AST and validates it's a single SELECT statement
   * @param sqlQuery - Normalized SQL query string
   * @returns Parsed AST of the SELECT statement
   * @throws Error if parsing fails or query is not a single SELECT statement
   */
  private parseSqlQuery(sqlQuery: string): Select {
    const parser = new Parser();
    let ast;
    try {
      ast = parser.astify(sqlQuery);
    } catch (parseError: any) {
      throw new Error(
        `SQL parsing error: ${parseError.message || "Invalid SQL syntax"}. Please check your query syntax.`,
      );
    }

    // Validate that query is a SELECT statement
    // Parser can return either an object (single statement) or an array (multiple statements)
    if (Array.isArray(ast)) {
      if (ast.length !== 1 || ast[0].type !== "select") {
        throw new Error(
          "Only a single SELECT query is allowed. Multiple statements or non-SELECT statements are not permitted.",
        );
      }
      return ast[0];
    } else if (ast && ast.type === "select") {
      return ast;
    } else {
      throw new Error("Only SELECT queries are allowed.");
    }
  }

  /**
   * Recursively extracts all table names from SQL AST node
   * @param node - AST node to extract tables from
   * @returns Array of table names (uppercase)
   */
  private extractTables(node: any): string[] {
    const tables: string[] = [];

    if (node.type === "table" || node.type === "dual") {
      if (node.table) {
        const tableName = node.table === "dual" ? "dual" : node.table.name || node.table;
        if (tableName && tableName !== "dual") {
          tables.push(tableName.toUpperCase());
        }
      }
    }

    if (node.from) {
      if (Array.isArray(node.from)) {
        node.from.forEach((fromItem: any) => {
          tables.push(...this.extractTables(fromItem));
        });
      } else {
        tables.push(...this.extractTables(node.from));
      }
    }

    if (node.join) {
      if (Array.isArray(node.join)) {
        node.join.forEach((joinItem: any) => {
          tables.push(...this.extractTables(joinItem));
        });
      } else {
        tables.push(...this.extractTables(node.join));
      }
    }

    return tables;
  }

  /**
   * Recursively checks if AST node contains scalar subqueries
   * @param node - AST node to check
   * @returns true if node contains scalar subquery, false otherwise
   */
  private hasScalarSubquery(node: any): boolean {
    if (!node) return false;

    if (node.type === "subquery" || (node.ast && node.ast.type === "select")) {
      return true;
    }

    if (Array.isArray(node)) {
      return node.some((item) => this.hasScalarSubquery(item));
    }

    if (typeof node === "object") {
      return Object.values(node).some((value) => this.hasScalarSubquery(value));
    }

    return false;
  }

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

    // Parse SQL query to validate structure before execution
    const selectAst = this.parseSqlQuery(normalized);

    // Extract all tables from the query
    const tablesInQuery = this.extractTables(selectAst);
    const uniqueTables = [...new Set(tablesInQuery)];

    // Check that only security_notes table is used
    const invalidTables = uniqueTables.filter((table) => table !== "SECURITY_NOTES");
    if (invalidTables.length > 0) {
      throw new Error(
        `Security violation: Query references table(s) other than 'security_notes': ${invalidTables.join(", ")}. ` +
          "Only queries against the security_notes table are allowed. " +
          "JOINs, subqueries, or references to other tables are not permitted for security reasons.",
      );
    }

    // Check for scalar subqueries in SELECT columns
    if (selectAst.columns && Array.isArray(selectAst.columns)) {
      const hasSubqueryInColumns = selectAst.columns.some((col: any) => {
        if (col.expr) {
          return this.hasScalarSubquery(col.expr);
        }
        return this.hasScalarSubquery(col);
      });

      if (hasSubqueryInColumns) {
        throw new Error(
          "Security violation: Scalar subqueries in SELECT columns are not allowed. " +
            "Subqueries can be used to access data from other tables or bypass security restrictions. " +
            "Please rewrite your query without using subqueries in the SELECT clause.",
        );
      }
    }

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

    // Check for references to other tables in the query execution plan
    // This detects JOINs, subqueries, or any other references to tables other than security_notes
    const tablesInPlan = explainRows.filter(
      (row) =>
        row.accessObject?.startsWith("table:") && row.accessObject !== "table:security_notes",
    );
    if (tablesInPlan.length > 0) {
      throw new Error(
        "Security violation: Query execution plan detected references to tables other than 'security_notes'. " +
          "Only queries against the security_notes table are allowed. " +
          "JOINs, subqueries, or references to other tables are not permitted for security reasons.",
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
    // Verify that required security fields exist and come from security_notes table
    // Also ensure all fields with orgTable come from security_notes (no JOINs or subqueries)
    if (!isAdmin && result?.metadata?.fields) {
      const fields = result.metadata.fields as Array<{
        name: string;
        schema?: string;
        table?: string;
        orgTable?: string;
      }>;

      // Check that created_by field(s) exist and ALL come from security_notes table
      const createdByFields = fields.filter((f) => f.name === "created_by");
      if (createdByFields.length === 0) {
        throw new Error(
          "Security validation failed: The query must include 'created_by' as a raw column in the SELECT statement. This field is required for row-level security enforcement.",
        );
      }
      const badCreatedByField = createdByFields.find(
        (f) => !f.orgTable || f.orgTable !== "security_notes",
      );
      if (badCreatedByField) {
        throw new Error(
          "Security validation failed: 'created_by' must come directly from the security_notes table. Joins, subqueries, or table aliases that change the origin of this column are not allowed.",
        );
      }

      // Check that target_user_id field(s) exist and ALL come from security_notes table
      const targetUserFields = fields.filter((f) => f.name === "target_user_id");
      if (targetUserFields.length === 0) {
        throw new Error(
          "Security validation failed: The query must include 'target_user_id' as a raw column in the SELECT statement. This field is required for row-level security enforcement.",
        );
      }
      const badTargetUserField = targetUserFields.find(
        (f) => !f.orgTable || f.orgTable !== "security_notes",
      );
      if (badTargetUserField) {
        throw new Error(
          "Security validation failed: 'target_user_id' must come directly from the security_notes table. Joins, subqueries, or table aliases that change the origin of this column are not allowed.",
        );
      }

      // Check that all fields with orgTable come from security_notes table
      // (This prevents JOINs or subqueries that reference other tables)
      // Note: Fields without orgTable (empty/undefined) are allowed - these are computed/calculated fields
      // We only check fields that have orgTable set - if orgTable exists, it must be "security_notes"
      const fieldsFromOtherTables = fields.filter(
        (f) => f.orgTable && f.orgTable !== "security_notes",
      );
      if (fieldsFromOtherTables.length > 0) {
        throw new Error(
          "Security validation failed: All fields must come from the security_notes table. " +
            "Fields from other tables detected, which indicates the use of JOINs, subqueries, or references to other tables. " +
            "This is not allowed for security reasons.",
        );
      }
    }

    return result;
  }
}

export const ROVO_SERVICE: RovoService = new RovoServiceImpl();
