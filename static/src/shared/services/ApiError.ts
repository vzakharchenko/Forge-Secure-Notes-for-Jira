// models
import { BaseFormServerValidation } from "src/shared/models/remoteClient";

export default class ApiError extends Error {
  public data: BaseFormServerValidation;
  public status: number;
  public isGlobalError: boolean;

  constructor(data: BaseFormServerValidation, status: number, isGlobalError: boolean) {
    super(data?.errorMessage ?? "Request failed");
    this.name = "ApiError";
    this.data = data;
    this.status = status;
    this.isGlobalError = isGlobalError;
  }
}
