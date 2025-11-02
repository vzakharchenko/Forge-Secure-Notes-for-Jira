import { formatLimitOffset } from "forge-sql-orm";
import { securityNotes } from "./entities";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  InferInsertModel,
  InferSelectModel,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { FORGE_SQL_ORM } from "./DbUtils";
import { withAppContext } from "../controllers/ApplicationContext";
import { UserViewInfoType } from "../../shared/responses/ViewMySecurityNotes";

export interface SecurityNoteRepository {
  getAllSecurityNotesByAccountId(
    accountId: string,
  ): Promise<InferSelectModel<typeof securityNotes>[]>;
  getAllMySecurityNotes(
    issueKey: string,
    accountId: string,
  ): Promise<InferSelectModel<typeof securityNotes>[]>;
  createSecurityNote(data: InferInsertModel<typeof securityNotes>): Promise<void>;
  deleteSecurityNote(id: string): Promise<void>;
  viewSecurityNote(id: string): Promise<void>;
  getSecurityNode(id: string): Promise<InferSelectModel<typeof securityNotes> | undefined>;
  getAllExpiredNotes(): Promise<InferSelectModel<typeof securityNotes>[]>;
  expireSecurityNote(ids: string[]): Promise<void>;
  getSecurityNoteUsers(): Promise<UserViewInfoType[]>;
}

class SecurityNoteRepositoryImpl implements SecurityNoteRepository {
  async getAllSecurityNotesByAccountId(
    accountId: string,
  ): Promise<InferSelectModel<typeof securityNotes>[]> {
    return FORGE_SQL_ORM.selectFrom(securityNotes).where(
      or(eq(securityNotes.createdBy, accountId), eq(securityNotes.targetUserId, accountId)),
    );
  }

  async viewSecurityNote(id: string): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateById(
      { status: "VIEWED", viewedAt: new Date(), id },
      securityNotes,
    );
  }

  @withAppContext()
  async createSecurityNote(data: Partial<InferInsertModel<typeof securityNotes>>): Promise<void> {
    await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().insert(securityNotes, [
      data as InferInsertModel<typeof securityNotes>,
    ]);
  }

  @withAppContext()
  async getAllMySecurityNotes(
    issueKey: string,
    accountId: string,
  ): Promise<InferSelectModel<typeof securityNotes>[]> {
    return FORGE_SQL_ORM.selectFrom(securityNotes)
      .where(
        and(
          eq(securityNotes.issueKey, issueKey),
          or(eq(securityNotes.targetUserId, accountId), eq(securityNotes.createdBy, accountId)),
          gte(securityNotes.expiryDate, new Date()),
          inArray(securityNotes.status, ["NEW", "VIEWED"]),
        ),
      )
      .orderBy(desc(securityNotes.expiryDate));
  }

  async getAllExpiredNotes(): Promise<InferSelectModel<typeof securityNotes>[]> {
    return FORGE_SQL_ORM.selectFrom(securityNotes)
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

export const SECURITY_NOTE_REPOSITORY: SecurityNoteRepository = new SecurityNoteRepositoryImpl();
