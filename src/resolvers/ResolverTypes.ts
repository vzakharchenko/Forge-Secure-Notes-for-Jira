export interface InvokePayload {
  call: {
    functionKey: string;
    payload?: {
      [key in number | string]: unknown;
    };
    jobId?: string;
  };
  context: unknown;
}

export interface Request {
  payload: unknown;
  context: InvokePayload["context"];
}
