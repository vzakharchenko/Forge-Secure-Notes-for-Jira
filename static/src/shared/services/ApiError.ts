// SPDX-FileCopyrightText: 2025 Trust Logic / Vasyl Zakharchenko
// SPDX-License-Identifier: BUSL-1.1

// models
import { ErrorResponse } from "@shared/Types";

export default class ApiError extends Error {
  public data: ErrorResponse;
  public isGlobalError: boolean;

  constructor(errorResponse: ErrorResponse, isGlobalError: boolean) {
    super(errorResponse?.message ?? "Request failed");
    this.name = "ApiError";
    this.data = errorResponse;
    this.isGlobalError = isGlobalError;
  }
}
