import { Result } from "@forge/sql/out/utils/types";
import { FORGE_SQL_ORM } from "../../database";
import { securityNotes } from "../../database";
import { getTableName } from "drizzle-orm";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { JiraUserService } from "../../user";

@injectable()
export class RovoService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
  ) {}

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
    const rovoIntegration = FORGE_SQL_ORM.rovo();
    const accountId = context.principal.accountId;
    const settings = await rovoIntegration
      .rovoRawSettingBuilder(getTableName(securityNotes), accountId)
      .addContextParameter(":currentUserId", accountId)
      .addContextParameter(":currentProjectKey", event.context?.jira?.projectKey ?? "")
      .addContextParameter(":currentIssueKey", event.context?.jira?.issueKey ?? "")
      .useRLS()
      .addRlsCondition(async () => await this.jiraUserService.isJiraAdmin())
      .addRlsColumn(securityNotes.createdBy)
      .addRlsColumn(securityNotes.targetUserId)
      .addRlsWherePart(
        (alias: string) =>
          `${alias}.${securityNotes.createdBy.name} = '${accountId}' OR ${alias}.${securityNotes.targetUserId.name} = '${accountId}' `,
      )
      .finish()
      .build();
    try {
      return await rovoIntegration.dynamicIsolatedQuery(event.sql, settings);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e.message, e);
      return { rows: [], metadata: {} };
    }
  }
}
