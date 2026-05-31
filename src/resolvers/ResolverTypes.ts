// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

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
