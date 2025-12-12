import { formatLimitOffset } from "forge-sql-orm";
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  InferInsertModel,
  InferSelectModel,
  isNotNull,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { FORGE_SQL_ORM } from "./DbUtils";
import { securityNotes } from "./entities";
import { withAppContext } from "../controllers";
import { UserViewInfoType } from "../../shared/responses";
import { injectable } from "inversify";

@injectable()
export class SecurityNoteRepository {
  async getAllSecurityNotesByIssue(
    issueIdOrKey: string,
    limit: number,
    offset: number,
    accountId: string | null,
  ): Promise<
    (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[]
  > {
    let accountIdCondition;
    if (accountId) {
      accountIdCondition = or(
        eq(securityNotes.createdBy, accountId),
        eq(securityNotes.targetUserId, accountId),
      );
    }

    const baseCondition = or(
      eq(securityNotes.issueId, issueIdOrKey),
      eq(securityNotes.issueKey, issueIdOrKey),
    );

    const whereCondition = accountIdCondition
      ? and(baseCondition, accountIdCondition)
      : baseCondition;
    return FORGE_SQL_ORM.selectCacheable({
      ...getTableColumns(securityNotes),
      count: sql<number>`COUNT(*) OVER()`,
    })
      .from(securityNotes)
      .where(whereCondition)
      .orderBy(desc(securityNotes.issueKey), desc(securityNotes.createdAt))
      .offset(formatLimitOffset(offset))
      .limit(formatLimitOffset(limit));
  }

  async getAllSecurityNotesByProject(
    projectIdOrKey: string,
    limit: number,
    offset: number,
    accountId: string | null,
  ): Promise<
    (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[]
  > {
    let accountIdCondition;
    if (accountId) {
      accountIdCondition = or(
        eq(securityNotes.createdBy, accountId),
        eq(securityNotes.targetUserId, accountId),
      );
    }

    const baseCondition = or(
      eq(securityNotes.projectKey, projectIdOrKey),
      eq(securityNotes.projectId, projectIdOrKey),
    );

    const whereCondition = accountIdCondition
      ? and(baseCondition, accountIdCondition)
      : baseCondition;

    return FORGE_SQL_ORM.selectCacheable({
      ...getTableColumns(securityNotes),
      count: sql<number>`COUNT(*) OVER()`,
    })
      .from(securityNotes)
      .where(whereCondition)
      .orderBy(desc(securityNotes.issueKey), desc(securityNotes.createdAt))
      .offset(formatLimitOffset(offset))
      .limit(formatLimitOffset(limit));
  }
  async getIssuesAndProjects(): Promise<
    {
      issueId: string | null;
      issueKey: string | null;
      projectId: string | null;
      projectKey: string | null;
    }[]
  > {
    return FORGE_SQL_ORM.selectCacheable({
      issueId: securityNotes.issueId,
      issueKey: securityNotes.issueKey,
      projectId: securityNotes.projectId,
      projectKey: securityNotes.projectKey,
    })
      .from(securityNotes)
      .where(isNotNull(securityNotes.issueId))
      .groupBy(
        securityNotes.issueId,
        securityNotes.issueKey,
        securityNotes.projectId,
        securityNotes.projectKey,
      );
  }
  async getAllSecurityNotesByAccountId(
    accountId: string,
    limit: number,
    offset: number,
  ): Promise<
    (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[]
  > {
    return FORGE_SQL_ORM.selectCacheable({
      ...getTableColumns(securityNotes),
      count: sql<number>`COUNT(*) OVER()`,
    })
      .from(securityNotes)
      .where(or(eq(securityNotes.createdBy, accountId), eq(securityNotes.targetUserId, accountId)))
      .orderBy(desc(securityNotes.issueKey), desc(securityNotes.createdAt))
      .offset(formatLimitOffset(offset))
      .limit(formatLimitOffset(limit));
  }

  async viewSecurityNote(id: string): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateById(
      { status: "VIEWED", viewedAt: new Date(), id },
      securityNotes,
    );
  }

  @withAppContext()
  async createSecurityNote(
    datas: Partial<InferInsertModel<typeof securityNotes>>[],
  ): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().insert(
      securityNotes,
      datas as InferInsertModel<typeof securityNotes>[],
    );
  }

  @withAppContext()
  async getAllMySecurityNotes(
    issueKey: string,
    accountId: string,
  ): Promise<
    (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[]
  > {
    return FORGE_SQL_ORM.select({
      ...getTableColumns(securityNotes),
      count: sql<number>`COUNT(*) OVER()`,
    })
      .from(securityNotes)
      .where(
        and(
          eq(securityNotes.issueKey, issueKey),
          or(eq(securityNotes.targetUserId, accountId), eq(securityNotes.createdBy, accountId)),
          gte(securityNotes.expiryDate, new Date()),
          inArray(securityNotes.status, ["NEW", "VIEWED"]),
        ),
      )
      .orderBy(desc(securityNotes.createdAt));
  }

  async getAllExpiredNotes(): Promise<
    (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[]
  > {
    return FORGE_SQL_ORM.select({
      ...getTableColumns(securityNotes),
      count: sql<number>`COUNT(*) OVER()`,
    })
      .from(securityNotes)
      .where(and(lt(securityNotes.expiryDate, new Date()), inArray(securityNotes.status, ["NEW"])))
      .orderBy(asc(securityNotes.expiryDate))
      .limit(formatLimitOffset(50));
  }

  async deleteSecurityNote(id: string): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateById(
      { status: "DELETED", deletedAt: new Date(), id },
      securityNotes,
    );
  }

  async expireSecurityNote(ids: string[]): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateFields(
      { status: "EXPIRED", expiredAt: new Date() },
      securityNotes,
      inArray(securityNotes.id, ids),
    );
  }

  async getSecurityNode(id: string): Promise<InferSelectModel<typeof securityNotes> | undefined> {
    const results = await FORGE_SQL_ORM.selectFrom(securityNotes).where(
      and(
        gte(securityNotes.expiryDate, new Date()),
        inArray(securityNotes.status, ["NEW"]),
        eq(securityNotes.id, id),
      ),
    );
    return results.length ? results[0] : undefined;
  }

  async getSecurityNoteUsers(): Promise<UserViewInfoType[]> {
    const result = await FORGE_SQL_ORM.executeCacheable<UserViewInfoType>(sql`
            WITH base AS (
                SELECT
                    target_user_id    AS target_user_id,
                    target_user_name  AS target_user_name,
                    target_avatar_url AS target_avatar_url,
                    created_by,
                    created_user_name,
                    created_avatar_url
                FROM \`security_notes\`
            )
            SELECT
                user_id    AS accountId,
                MIN(user_name)   AS displayName,
                MIN(avatar_url)  AS avatarUrl
            FROM (
                     SELECT target_user_id AS user_id,
                            target_user_name AS user_name,
                            target_avatar_url AS avatar_url
                     FROM base
                     UNION ALL
                     SELECT created_by AS user_id,
                            created_user_name AS user_name,
                            created_avatar_url AS avatar_url
                     FROM base
                 ) all_users
            GROUP BY user_id;
    `);
    return result?.length ? (result[0] as any) : [];
  }
}
