import {ErrorResponse, SecurityNoteStatus, ViewTimeOutType} from "../Types";


export type UserViewInfoType = {
    accountId:string;
    displayName: string;
    avatarUrl: string;
};

export interface ViewMySecurityNotes extends ErrorResponse {
    id: string;
    createdBy: UserViewInfoType;
    targetUser: UserViewInfoType;
    viewTimeOut: ViewTimeOutType;
    status: SecurityNoteStatus;
    expiration: Date;
    expiry: string;
    issueId?: string;
    issueKey?: string;
    createdAt: Date;
    viewedAt?: Date;
    deletedAt?: Date;
}

let EMPTY_USER = {
    accountId:'',
    displayName: '',
    avatarUrl: '',
};

