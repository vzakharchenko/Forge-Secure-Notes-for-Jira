import {ForgeTypes} from "../core/Types";

export type CurrentUser = {
    accountId: string;
    emailAddress: string;
    displayName: string;
    active: true;
    timeZone: string;
    avatarUrls: {
        "48x48": string;
        "24x24": string;
        "16x16": string;
        "32x32": string;
    };
    locale: string;
};

export enum ServiceType {
    JIRA,
    CONFLUENCE,
}

export interface UserService {
    getServiceType(): ServiceType;

    getCurrentUser(): Promise<CurrentUser>;

    getUserById(userId: string): Promise<CurrentUser>;
}

export interface UserFactory {
    getUserService(type: ForgeTypes): UserService;
}
