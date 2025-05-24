import {ErrorResponse, SecurityNoteStatus, ViewTimeOutType} from "../../core/Types";


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
    issueId: string;
    issueKey: string;
    createdAt: Date;
    viewedAt?: Date;
    deletedAt?: Date;
}

let EMPTY_USER = {
    accountId:'',
    displayName: '',
    avatarUrl: '',
};
export const PERMISSION_ERROR_OBJECT: ViewMySecurityNotes = {
    isError: true,
    createdBy: EMPTY_USER,
    targetUser: EMPTY_USER,
    viewTimeOut: '3mins',
    status: 'DELETED',
    expiration: new Date(),
    issueId: '',
    issueKey: '',
    createdAt: new Date(),
    id: ''
};
