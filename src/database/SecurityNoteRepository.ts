import {formatLimitOffset} from "forge-sql-orm";
import {securityNotes} from "./entities";
import {and, asc, desc, eq, gte, inArray, InferInsertModel, InferSelectModel, lt, or} from "drizzle-orm";
import {FORGE_SQL_ORM} from "./DbUtils";
import {withAppContext} from "../controllers/ApplicationContext";

export interface SecurityNoteRepository {
    getAllMySecurityNotes(issueKey: string, accountId: string): Promise<InferSelectModel<typeof securityNotes>[]>;
    createSecurityNote(data:InferInsertModel<typeof securityNotes>):Promise<void>
    deleteSecurityNote(id: string):Promise<void>
    viewSecurityNote(id: string):Promise<void>
    getSecurityNode(id: string): Promise<InferSelectModel<typeof securityNotes> | undefined>
    getAllExpiredNotes(): Promise<InferSelectModel<typeof securityNotes>[]>
    expireSecurityNote(ids: string[]): Promise<void>
}

class SecurityNoteRepositoryImpl implements SecurityNoteRepository {

    async viewSecurityNote(id: string): Promise<void> {
        await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateById({status: 'VIEWED', viewedAt: new Date(), id}, securityNotes);
    }

    @withAppContext()
    async createSecurityNote(data: Partial<InferInsertModel<typeof securityNotes>>): Promise<void> {
       await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().insert(securityNotes,[data as InferInsertModel<typeof securityNotes>]);
    }

    @withAppContext()
    async getAllMySecurityNotes(issueKey: string, accountId: string): Promise<InferSelectModel<typeof securityNotes>[]> {
        return  FORGE_SQL_ORM.selectFrom(securityNotes).where(
            and(
                eq(securityNotes.issueKey, issueKey),
                or(eq(securityNotes.targetUserId, accountId), eq(securityNotes.createdBy, accountId)),
                gte(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW','VIEWED'])
            )
        ).orderBy(desc(securityNotes.expiryDate));
    }

    async getAllExpiredNotes(): Promise<InferSelectModel<typeof securityNotes>[]> {
        return FORGE_SQL_ORM.selectCacheableFrom(securityNotes).where(
            and(
                lt(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW'])
            )
        ).orderBy(asc(securityNotes.expiryDate)).limit(formatLimitOffset(50));
    }

    async deleteSecurityNote(id: string): Promise<void> {
        await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateById({status: 'DELETED', deletedAt: new Date(), id}, securityNotes);
    }

    async expireSecurityNote(ids: string[]): Promise<void> {
        await FORGE_SQL_ORM.modifyWithVersioningAndEvictCache().updateFields({status: 'EXPIRED', expiredAt: new Date()}, securityNotes, inArray(securityNotes.id, ids));
    }

    async getSecurityNode(id: string): Promise<InferSelectModel<typeof securityNotes> | undefined> {
        const results = await FORGE_SQL_ORM.selectCacheableFrom(securityNotes).where(
            and(
                gte(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW']),
                eq(securityNotes.id,id)
            )
        );
        return results.length ? results[0] : undefined;
    }
}

export const SECURITY_NOTE_REPOSITORY:SecurityNoteRepository = new SecurityNoteRepositoryImpl()