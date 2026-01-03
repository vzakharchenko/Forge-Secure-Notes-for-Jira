import { Result } from "@forge/sql/out/utils/types";
import { FORGE_SQL_ORM, securityNotes } from "../database";
import { getTableName } from "drizzle-orm";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../constants";
import { JiraUserService } from "../jira";

@injectable()
export class RovoService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
  ) {}

  private extractKeys(jiraContext: {
    issueKey?: string;
    projectKey?: string;
    url?: string;
    jiraContexts?: { projectKey: string }[];
  }): { issueKey: string; projectKey: string } {
    const issueKey = jiraContext?.issueKey ?? "";
    let projectKey = jiraContext?.projectKey;
    if (!projectKey && jiraContext?.jiraContexts?.[0]?.projectKey) {
      projectKey = jiraContext?.jiraContexts?.[0]?.projectKey;
    } else {
      projectKey = undefined;
    }

    // If projectKey is still not found, try to extract it from jiraContexts URL
    if (!projectKey && jiraContext?.url) {
      // Match patterns: projects/${projectKey} or project/${projectKey}
      const regex = /projects?\/([^/]+)/;
      const match = regex.exec(jiraContext.url);
      projectKey = match?.[1];
    }

    // Final fallback
    if (!projectKey) {
      projectKey = "''";
    }

    return { issueKey, projectKey };
  }

  async runSecurityNotesQuery(
    event: {
      sql: string;
      context: {
        jira: {
          issueKey: string;
          projectKey: string;
          jiraContexts?: { url: string; projectKey: string }[];
        };
      };
    },
    context: { principal: { accountId: string } },
  ): Promise<Result<unknown>> {
    const rovoIntegration = FORGE_SQL_ORM.rovo();
    const accountId = context.principal.accountId;
    const { issueKey, projectKey } = this.extractKeys(event.context?.jira);
    const settings = await rovoIntegration
      .rovoRawSettingBuilder(getTableName(securityNotes), accountId)
      .addStringContextParameter(":currentUserId", accountId)
      .addStringContextParameter(":currentProjectKey", projectKey)
      .addStringContextParameter(":currentIssueKey", issueKey)
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
