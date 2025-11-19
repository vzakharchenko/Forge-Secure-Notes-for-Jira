// models
import { ServerError } from "@src/shared/models/remoteClient";
import { ValidationErrors } from "@shared/Types";

// helpers
import { showErrorFlag } from "@src/shared/utils/flags";

export const handleServerFormValidation = (error: ServerError | null): ValidationErrors | null => {
  if (error === null) return null;
  return error.data?.validationErrors ?? null;
};

export const handleServerErrorMessage = (error: ServerError | null) => {
  if (error === null) return "";
  return error.data?.message ?? "";
};

export const handleDefaultServerError = (error: ServerError | null, defaultMessage?: string) => {
  if (error?.isGlobalError) return;
  const message = handleServerErrorMessage(error) || defaultMessage;
  if (message) {
    showErrorFlag({ title: message });
  }
};
