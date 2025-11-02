import { ErrorResponse, SecurityNoteStatus, ViewTimeOutType } from "../Types";

export type UserViewInfoType = {
  accountId: string;
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
  projectId?: string;
  issueKey?: string;
  projectKey?: string;
  createdAt: Date;
  viewedAt?: Date;
  deletedAt?: Date;
  count?: number;
}

let EMPTY_USER = {
  accountId: "",
  displayName: "",
  avatarUrl: "",
};
