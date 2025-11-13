export type ServerResponseTypeName = "common" | "pagination";

export type PromisedServerResponse<
  DataT = null,
  ResponseType extends ServerResponseTypeName = "common",
> = Promise<ServerResponse<DataT, ResponseType>>;

export type ServerResponse<
  DataT = null,
  ResponseType extends ServerResponseTypeName = "common",
> = ServerResponseType<DataT, ResponseType>;

export interface RemoteClientResponse<T = unknown> {
  result: T;
  // TODO: check additional info
  // status: number;
  // headers: Record<string, unknown>;
  // config: unknown;
}

export type ServerResponseType<
  DataT,
  ResponseType extends ServerResponseTypeName = "common",
> = ResponseType extends "common"
  ? DataT
  : ResponseType extends "pagination"
    ? PaginationServerResponse<DataT>
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

// Error response
export type ServerError<DataT = BaseFormServerValidation> = {
  status: number;
  data: DataT;
  isGlobalError: boolean;
};

export type ServerFormValidationError = Record<string, string[]>;

export type BaseFormServerValidation = {
  errorMessage?: string;
  formValidation?: ServerFormValidationError;
  requestId?: string;
};

export interface GlobalError {
  title: string;
  description: string;
  requestId?: string;
}

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
