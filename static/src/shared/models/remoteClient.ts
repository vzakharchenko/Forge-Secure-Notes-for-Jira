// models
import { ErrorResponse } from "@shared/Types";

export type ServerResponseTypeName = "common" | "pagination" | "jiraUserPagination";

export type JiraPromisedServerResponse<
  DataT = null,
  ResponseType extends ServerResponseTypeName = "common",
> = Promise<ServerResponseType<DataT, ResponseType>>;

export type PromisedServerResponse<
  DataT = null,
  ResponseType extends ServerResponseTypeName = "common",
> = Promise<ServerResponse<DataT, ResponseType>>;

export type ServerResponse<
  DataT = null,
  ResponseType extends ServerResponseTypeName = "common",
> = ServerResponseType<DataT, ResponseType>;

export interface RemoteClientResponse<T = unknown> extends ErrorResponse {
  result: T;
}

export type ServerResponseType<
  DataT,
  ResponseType extends ServerResponseTypeName = "common",
> = ResponseType extends "common"
  ? DataT
  : ResponseType extends "pagination"
    ? PaginationServerResponse<DataT>
    : ResponseType extends "jiraUserPagination"
      ? JiraUsersPaginationServerResponse<DataT>
      : never;

export interface PaginationServerResponse<DataT> {
  content: DataT[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface JiraUsersPaginationServerResponse<DataT> {
  users: DataT[];
  header: string;
  total: number;
}

// Error response
export type ServerError = {
  status: number;
  data: ErrorResponse;
  isGlobalError: boolean;
};

// Response statuses
export enum ResponseStatuses {
  OK = 200,
  UNAUTHORIZED = 401,
  NO_LICENCE = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  NOT_EXECUTABLE_CONTENT = 422,
  MANY_REQUESTS = 429,
  SERVER_ERROR = 500,
}
