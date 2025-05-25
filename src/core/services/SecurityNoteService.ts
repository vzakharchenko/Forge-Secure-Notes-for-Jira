import {ViewMySecurityNotes} from "../../controllers/responses/ViewMySecurityNotes";
import {SECURITY_NOTE_REPOSITORY} from "../../database/SecurityNoteRepository";
import {SecurityNoteStatus} from "../Types";
import {applicationContext, getAppContext, withAppContext} from "../../controllers/ApplicationContext";
import {NewSecurityNote} from "../../controllers/dto/NewSecurityNote";
import {SECURITY_STORAGE} from "../../storage/SecurityStorage";
import {InferInsertModel} from "drizzle-orm";
import {USER_FACTORY} from "../../user/UserServiceFactory";
import {securityNotes} from "../../database/entities";
import {calculateHash} from "../utils/cryptoUtils";
import {v4} from "uuid";
import {
    sendExpirationNotification,
    sendIssueNotification,
    sendNoteDeletedNotification
} from "../utils/sendIssueNotification";
import {isIssueContext, IssueContext} from "./ContextTypes";
import {SecurityNoteData} from "../../controllers/responses/SecurityNoteData";

export interface SecurityNoteService {
    getMySecurityNoteIssue(): Promise<ViewMySecurityNotes[]>

    createSecurityNote(securityNote: NewSecurityNote): Promise<void>

    deleteSecurityNote(securityNoteId: string): Promise<void>

    isValidLink(securityNoteId: string): Promise<boolean>

    getSecuredData(securityNoteId: string, key: string): Promise<SecurityNoteData | undefined>

    expireSecurityNotes(): Promise<void>
}

class SecurityNoteServiceImpl implements SecurityNoteService {

    async expireSecurityNotes(): Promise<void> {
        console.log('RUN EXPIRE TRIGGER')
        const notes = await SECURITY_NOTE_REPOSITORY.getAllExpiredNotes();
        if (notes?.length) {
            for (const note of notes) {
                await SECURITY_STORAGE.deletePayload(note.id);
                try {
                    if (note.issueKey) {
                        await sendExpirationNotification({
                            issueKey: note.issueKey,
                            recipientAccountId: note.targetUserId,
                            displayName: note.createdUserName
                        })
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            await SECURITY_NOTE_REPOSITORY.expireSecurityNote(notes.map((n) => n.id))
        }
    }

    @withAppContext()
    async getSecuredData(securityNoteId: string, key: string): Promise<SecurityNoteData | undefined> {
        const sn = await SECURITY_NOTE_REPOSITORY.getSecurityNode(securityNoteId);
        const accountId = getAppContext()!.accountId;
        if (!sn) {
            return undefined;
        }
        if (sn.encryptionKeyHash !== await calculateHash(key, accountId)) {
            throw new Error(`SecurityKey is not valid, please ask ${sn.createdUserName} to sent you it. `);
        }
        const encryptedData = await SECURITY_STORAGE.getPayload(securityNoteId);
        if (!encryptedData) {
            console.error('data does not exists');
            await SECURITY_NOTE_REPOSITORY.deleteSecurityNote(securityNoteId);
            return undefined;
        }
        await SECURITY_STORAGE.deletePayload(securityNoteId);
        await SECURITY_NOTE_REPOSITORY.viewSecurityNote(securityNoteId);
        return {
            id: sn.id,
            iv: sn.iv,
            salt: sn.salt,
            encryptedData: encryptedData,
            viewTimeOut: 300,
            expiry: sn.expiry
        }
    }

    @withAppContext()
    async isValidLink(securityNoteId: string): Promise<boolean> {
        const {accountId} = getAppContext()!
        const sn = await SECURITY_NOTE_REPOSITORY.getSecurityNode(securityNoteId);
        return Boolean(accountId) && accountId === sn?.targetUserId
    }

    addHours(date: Date, hours: number): Date {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }

    getExpire(expire: string): Date {
        switch (expire) {
            case "1h": {
                return this.addHours(new Date(), 1)
            }
            case "1d": {
                return this.addHours(new Date(), 24)
            }
            case "7d": {
                return this.addHours(new Date(), 24 * 7)
            }
            default: {
                return this.addHours(new Date(), 24 * 10)
            }

        }
    }

    @withAppContext()
    async getMySecurityNoteIssue(): Promise<ViewMySecurityNotes[]> {
        const {accountId, context} = applicationContext.getStore()!;
        if (!isIssueContext(context)) {
            throw new Error('expected Issue context')
        }
        const issueContext = context as IssueContext;
        const {key, id} = issueContext.extension.issue;
        const securityDbNotes = await SECURITY_NOTE_REPOSITORY.getAllMySecurityNotes(key, accountId);
        if (securityDbNotes) {
            return securityDbNotes.map(sn => {
                return {
                    id: sn.id,
                    createdBy: {
                        displayName: sn.createdUserName,
                        accountId: sn.createdBy,
                        avatarUrl: sn.createdAvatarUrl
                    },
                    targetUser: {
                        displayName: sn.targetUserName,
                        accountId: sn.targetUserId,
                        avatarUrl: sn.targetAvatarUrl
                    },
                    viewTimeOut: '5mins',
                    status: sn.status as SecurityNoteStatus,
                    expiration: sn.expiryDate,
                    issueId: sn.issueId ?? id,
                    issueKey: sn.issueKey ?? key,
                    createdAt: sn.createdAt,
                    viewedAt: sn.viewedAt ?? undefined,
                    deletedAt: sn.deletedAt ?? undefined,
                    expiry: sn.expiry,
                }
            })
        }
        return [];
    }

    @withAppContext()
    async createSecurityNote(securityNote: NewSecurityNote): Promise<void> {
        const appContext = getAppContext()!;
        const accountId = appContext.accountId;
        const context = appContext.context as IssueContext;
        const data: Partial<InferInsertModel<typeof securityNotes>> = {
            issueKey: context.extension.issue.key,
            issueId: context.extension.issue.id,
            targetUserId: securityNote.targetUser,
            targetUserName: securityNote.targetUserName,
            encryptionKeyHash: await calculateHash(securityNote.encryptionKeyHash, securityNote.targetUser),
            iv: securityNote.iv,
            salt: securityNote.salt,
            isCustomExpiry: securityNote.isCustomExpiry ? 1 : 0,
            expiry: securityNote.expiry
        }
        data.createdBy = accountId;
        const currentUser = await USER_FACTORY.getUserService(appContext.forgeType).getCurrentUser();
        if (currentUser) {
            data.createdUserName = currentUser.displayName;
            data.createdAvatarUrl = currentUser.avatarUrls["32x32"];

        } else {
            data.createdUserName = accountId;
            data.createdAvatarUrl = '';
        }
        const targetUser = await USER_FACTORY.getUserService(appContext.forgeType).getUserById(String(data.targetUserId));
        if (targetUser) {
            data.targetUserName = targetUser.displayName;
            data.targetAvatarUrl = targetUser.avatarUrls["32x32"];
        } else {
            data.targetAvatarUrl = '';
        }
        data.createdAt = new Date();
        data.expiryDate = Number(data.isCustomExpiry) > 0 ? new Date(String(data.expiry)) : this.getExpire(String(data.expiry));
        data.status = 'NEW';
        data.id = v4();
        await SECURITY_NOTE_REPOSITORY.createSecurityNote(data as InferInsertModel<typeof securityNotes>);
        await SECURITY_STORAGE.savePayload(data.id, securityNote.encryptedPayload);
        const appUrlParts = context.localId.split("/");
        const appUrl = `${appUrlParts[1]}/${appUrlParts[2]}/view/${data.id}`;
        const noteLink = `${context.siteUrl}/jira/apps/${appUrl}`;
        try {
            await sendIssueNotification({
                issueKey: context.extension.issue.key,
                recipientAccountId: targetUser?.accountId ?? securityNote.targetUser,
                displayName: currentUser?.displayName,
                noteLink: noteLink,
                expiryDate: data.expiryDate
            })
        } catch (e) {
            console.error(e);
        }

    }

    async deleteSecurityNote(securityNoteId: string): Promise<void> {
        await SECURITY_STORAGE.deletePayload(securityNoteId);
        const sn = await SECURITY_NOTE_REPOSITORY.getSecurityNode(securityNoteId);
        if (sn) {
            await SECURITY_NOTE_REPOSITORY.deleteSecurityNote(securityNoteId);
            try {
                await sendNoteDeletedNotification({
                    issueKey: sn!.issueKey ?? '', recipientAccountId: sn.targetUserId, displayName: sn.createdUserName
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
}

export const SECURITY_NOTE_SERVICE: SecurityNoteService = new SecurityNoteServiceImpl()