import {formatLimitOffset} from "forge-sql-orm";
import {securityNotes} from "./entities";
import {and, asc, desc, eq, gte, inArray, InferInsertModel, InferSelectModel, lt, or} from "drizzle-orm";
import {DbRepository} from "./DbRepository";
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

class SecurityNoteRepositoryImpl extends DbRepository implements SecurityNoteRepository {


    async viewSecurityNote(id: string): Promise<void> {
        await this.getForgeSql().modify().updateById({status: 'VIEWED', viewedAt: new Date(), id}, securityNotes);
    }

    @withAppContext()
    async createSecurityNote(data: Partial<InferInsertModel<typeof securityNotes>>): Promise<void> {
       await this.getForgeSql().modify().insert(securityNotes,[data as InferInsertModel<typeof securityNotes>]);
    }

    @withAppContext()
    async getAllMySecurityNotes(issueKey: string, accountId: string): Promise<InferSelectModel<typeof securityNotes>[]> {
        const res = await this.getForgeSql().select({
            securityNotes
        }).from(securityNotes).where(
            and(
                eq(securityNotes.issueKey, issueKey),
                or(eq(securityNotes.targetUserId, accountId), eq(securityNotes.createdBy, accountId)),
                gte(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW','VIEWED'])
            )
        ).orderBy(desc(securityNotes.expiryDate));
        return res.map(r=>r.securityNotes)
    }

    async getAllExpiredNotes(): Promise<InferSelectModel<typeof securityNotes>[]> {
        const res = await this.getForgeSql().select({
            securityNotes: securityNotes
        }).from(securityNotes).where(
            and(
                lt(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW','VIEWED'])
            )
        ).orderBy(asc(securityNotes.expiryDate)).limit(formatLimitOffset(50));
        return res.map(r=>r.securityNotes)
    }

    async deleteSecurityNote(id: string): Promise<void> {
        await this.getForgeSql().modify().updateById({status: 'DELETED', deletedAt: new Date(), id}, securityNotes);
    }

    async expireSecurityNote(ids: string[]): Promise<void> {
        await this.getForgeSql().modify().updateFields({status: 'EXPIRED', expiredAt: new Date()}, securityNotes, inArray(securityNotes.id, ids));
    }

    async getSecurityNode(id: string): Promise<InferSelectModel<typeof securityNotes> | undefined> {
        const res = await this.getForgeSql().fetch().executeQueryOnlyOne(this.getForgeSql().select({
            securityNotes
        }).from(securityNotes).where(
            and(
                gte(securityNotes.expiryDate, new Date()),
                inArray(securityNotes.status, ['NEW']),
                eq(securityNotes.id,id)
            )
        ));
        return res?.securityNotes
    }
}

export const SECURITY_NOTE_REPOSITORY:SecurityNoteRepository = new SecurityNoteRepositoryImpl()