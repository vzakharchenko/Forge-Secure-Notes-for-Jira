import { UserViewInfoType, ViewMySecurityNotes } from "../../../shared/responses";
import { SecurityNoteStatus, SHARED_EVENT_NAME } from "../../../shared/Types";
import { getAppContext, withAppContext } from "../../controllers";
import { NewSecurityNote } from "../../../shared/dto";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { securityNotes } from "../../database";
import {
  calculateHash,
  sendExpirationNotification,
  sendIssueNotification,
  sendNoteDeletedNotification,
} from "../utils";
import { v4 } from "uuid";
import { isIssueContext, IssueContext } from "./ContextTypes";
import {
  SecurityNoteData,
  ProjectInfo,
  ProjectIssue,
  OpenSecurityNote,
} from "../../../shared/responses";
import { publishGlobal } from "@forge/realtime";
import { inject, injectable } from "inversify";
import { FORGE_INJECTION_TOKENS } from "../../constants";
import { JiraUserService } from "../../user";
import { SecurityNoteRepository } from "../../database";
import { BootstrapService } from "./BootstrapService";
import { SecurityStorage } from "../../storage";

@injectable()
export class SecurityNoteService {
  constructor(
    @inject(FORGE_INJECTION_TOKENS.JiraUserService)
    private readonly jiraUserService: JiraUserService,
    @inject(FORGE_INJECTION_TOKENS.SecurityNoteRepository)
    private readonly securityNoteRepository: SecurityNoteRepository,
    @inject(FORGE_INJECTION_TOKENS.BootstrapService)
    private readonly bootstrapService: BootstrapService,
    @inject(FORGE_INJECTION_TOKENS.SecurityStorage)
    private readonly securityStorage: SecurityStorage,
  ) {}

  private mapSecurityNotesToView(
    securityDbNotes: (InferSelectModel<typeof securityNotes> & {
      count: number;
    })[],
    defaults?: {
      issueId?: string;
      issueKey?: string;
      projectId?: string;
      projectKey?: string;
    },
  ): ViewMySecurityNotes[] {
    if (!securityDbNotes || securityDbNotes.length === 0) {
      return [];
    }
    return securityDbNotes.map((sn) => ({
      id: sn.id,
      createdBy: {
        displayName: sn.createdUserName,
        accountId: sn.createdBy,
        avatarUrl: sn.createdAvatarUrl,
      },
      targetUser: {
        displayName: sn.targetUserName,
        accountId: sn.targetUserId,
        avatarUrl: sn.targetAvatarUrl,
      },
      viewTimeOut: "5mins",
      status: sn.status as SecurityNoteStatus,
      expiration: sn.expiryDate,
      issueId: sn.issueId ?? defaults?.issueId ?? undefined,
      issueKey: sn.issueKey ?? defaults?.issueKey ?? undefined,
      projectId: sn.projectId ?? defaults?.projectId ?? undefined,
      projectKey: sn.projectKey ?? defaults?.projectKey ?? undefined,
      createdAt: sn.createdAt,
      viewedAt: sn.viewedAt ?? undefined,
      deletedAt: sn.deletedAt ?? undefined,
      expiry: sn.expiry,
      description: sn.description ?? undefined,
      count: sn.count,
    }));
  }
  @withAppContext()
  async getSecurityNoteByIssue(
    issueIdOrKey: string,
    limit: number,
    offset: number,
  ): Promise<ViewMySecurityNotes[]> {
    const context = getAppContext()!;
    let isAdmin = await this.bootstrapService.isAdmin();
    const securityDbNotes = await this.securityNoteRepository.getAllSecurityNotesByIssue(
      issueIdOrKey,
      limit,
      offset,
      isAdmin ? null : context.accountId,
    );
    return this.mapSecurityNotesToView(securityDbNotes);
  }
  @withAppContext()
  async getSecurityNoteByProject(
    projectIdOrKey: string,
    limit: number,
    offset: number,
  ): Promise<ViewMySecurityNotes[]> {
    const context = getAppContext()!;
    let isAdmin = await this.bootstrapService.isAdmin();
    const securityDbNotes = await this.securityNoteRepository.getAllSecurityNotesByProject(
      projectIdOrKey,
      limit,
      offset,
      isAdmin ? null : context.accountId,
    );
    return this.mapSecurityNotesToView(securityDbNotes);
  }

  async getIssuesAndProjects(): Promise<ProjectIssue> {
    return {
      result: (await this.securityNoteRepository.getIssuesAndProjects()) as ProjectInfo[],
    };
  }
  @withAppContext()
  async getSecurityNoteByAccountId(
    accountId: string,
    limit: number,
    offset: number,
  ): Promise<ViewMySecurityNotes[]> {
    const context = getAppContext()!;
    if (!(await this.bootstrapService.isAdmin()) && context.accountId !== accountId) {
      return [];
    }
    const securityDbNotes = await this.securityNoteRepository.getAllSecurityNotesByAccountId(
      accountId,
      limit,
      offset,
    );
    return this.mapSecurityNotesToView(securityDbNotes);
  }

  async getSecurityNoteUsers(): Promise<UserViewInfoType[]> {
    return this.securityNoteRepository.getSecurityNoteUsers();
  }

  async expireSecurityNotes(): Promise<void> {
    const notes = await this.securityNoteRepository.getAllExpiredNotes();
    if (notes?.length) {
      for (const note of notes) {
        await this.securityStorage.deletePayload(note.id);
        try {
          if (note.issueKey) {
            await sendExpirationNotification({
              issueKey: note.issueKey,
              recipientAccountId: note.targetUserId,
              displayName: note.createdUserName,
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      }
      await this.securityNoteRepository.expireSecurityNote(notes.map((n) => n.id));
    }
  }

  @withAppContext()
  async getSecuredData(securityNoteId: string, key: string): Promise<SecurityNoteData | undefined> {
    const sn = await this.securityNoteRepository.getSecurityNode(securityNoteId);
    if (!sn) {
      return undefined;
    }
    if (sn.encryptionKeyHash !== (await calculateHash(key, sn.targetUserId))) {
      throw new Error(
        `SecurityKey is not valid, please ask ${sn.createdUserName} to sent you it. `,
      );
    }
    const encryptedData = await this.securityStorage.getPayload(securityNoteId);
    if (!encryptedData) {
      // eslint-disable-next-line no-console
      console.error("data does not exists");
      await this.securityNoteRepository.deleteSecurityNote(securityNoteId);
      return undefined;
    }
    await this.securityStorage.deletePayload(securityNoteId);
    await this.securityNoteRepository.viewSecurityNote(securityNoteId);
    await publishGlobal(SHARED_EVENT_NAME, sn.issueId ?? "");
    return {
      id: sn.id,
      iv: sn.iv,
      salt: sn.salt,
      encryptedData: encryptedData,
      viewTimeOut: 300,
      expiry: sn.expiry,
    };
  }

  @withAppContext()
  async isValidLink(securityNoteId: string): Promise<OpenSecurityNote> {
    const accountId = getAppContext()?.accountId;
    if (!accountId) return { valid: false };

    const sn = await this.securityNoteRepository.getSecurityNode(securityNoteId);
    if (!sn) return { valid: false };

    const isValid = sn.targetUserId === accountId;

    return {
      valid: isValid,
      sourceAccountId: isValid
        ? await calculateHash(sn.description ?? sn.createdBy, sn.createdBy)
        : undefined,
    };
  }

  addHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
  }

  getExpire(expire: string): Date {
    switch (expire) {
      case "1h": {
        return this.addHours(new Date(), 1);
      }
      case "1d": {
        return this.addHours(new Date(), 24);
      }
      case "7d": {
        return this.addHours(new Date(), 24 * 7);
      }
      default: {
        return this.addHours(new Date(), 24 * 10);
      }
    }
  }

  @withAppContext()
  async getMySecurityNoteIssue(): Promise<ViewMySecurityNotes[]> {
    const { accountId, context } = getAppContext()!;
    if (!isIssueContext(context)) {
      throw new Error("expected Issue context");
    }

    const issueContext = context as IssueContext;
    const { key, id } = issueContext.extension.issue;
    const securityDbNotes = await this.securityNoteRepository.getAllMySecurityNotes(key, accountId);
    return this.mapSecurityNotesToView(securityDbNotes, {
      issueId: id,
      issueKey: key,
      projectId: issueContext.extension.project.id,
      projectKey: issueContext.extension.project.key,
    });
  }

  @withAppContext()
  async createSecurityNote(securityNote: NewSecurityNote): Promise<void> {
    const appContext = getAppContext()!;
    const accountId = appContext.accountId;
    const context = appContext.context as IssueContext;
    const datas: Partial<InferInsertModel<typeof securityNotes>>[] = [];
    const currentUser = await this.jiraUserService.getCurrentUser();
    for (const targetUser of securityNote.targetUsers) {
      const data: Partial<InferInsertModel<typeof securityNotes>> = {
        issueKey: context.extension.issue.key,
        issueId: context.extension.issue.id,
        projectId: context.extension.project.id,
        projectKey: context.extension.project.key,
        targetUserId: targetUser.accountId,
        targetUserName: targetUser.userName,
        encryptionKeyHash: await calculateHash(
          securityNote.encryptionKeyHash,
          targetUser.accountId,
        ),
        iv: securityNote.iv,
        salt: securityNote.salt,
        isCustomExpiry: securityNote.isCustomExpiry ? 1 : 0,
        expiry: securityNote.expiry,
        description: securityNote.description,
      };
      data.createdBy = accountId;
      if (currentUser) {
        data.createdUserName = currentUser.displayName;
        data.createdAvatarUrl = currentUser.avatarUrls["32x32"];
      } else {
        data.createdUserName = accountId;
        data.createdAvatarUrl = "";
      }
      const targetUserInfo = await this.jiraUserService.getUserById(String(data.targetUserId));
      if (targetUserInfo) {
        data.targetUserName = targetUserInfo.displayName;
        data.targetAvatarUrl = targetUserInfo.avatarUrls["32x32"];
      } else {
        data.targetAvatarUrl = "";
      }
      data.createdAt = new Date();
      data.expiryDate =
        Number(data.isCustomExpiry) > 0
          ? new Date(String(data.expiry))
          : this.getExpire(String(data.expiry));
      data.status = "NEW";
      data.id = v4();
      datas.push(data);
    }
    await this.securityNoteRepository.createSecurityNote(
      datas as Partial<InferInsertModel<typeof securityNotes>>[],
    );
    for (const data of datas) {
      await this.securityStorage.savePayload(String(data.id), securityNote.encryptedPayload);
      const appUrlParts = context.localId.split("/");
      const appUrl = `${appUrlParts[1]}/${appUrlParts[2]}/view/${data.id}`;
      const noteLink = `${context.siteUrl}/jira/apps/${appUrl}`;
      try {
        await sendIssueNotification({
          issueKey: context.extension.issue.key,
          recipientAccountId: String(data.targetUserId),
          displayName: currentUser?.displayName ?? accountId,
          noteLink: noteLink,
          expiryDate: data.expiryDate as Date,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }

  async deleteSecurityNote(securityNoteId: string): Promise<void> {
    await this.securityStorage.deletePayload(securityNoteId);
    const sn = await this.securityNoteRepository.getSecurityNode(securityNoteId);
    if (sn) {
      await this.securityNoteRepository.deleteSecurityNote(securityNoteId);
      try {
        await sendNoteDeletedNotification({
          issueKey: sn!.issueKey ?? "",
          recipientAccountId: sn.targetUserId,
          displayName: sn.createdUserName,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }
}
