//libs
import { invoke } from "@forge/bridge";

// helpers
import { showErrorFlag, showWarningFlag } from "@src/shared/utils/flags";
import ApiError from "@src/shared/services/ApiError";

// models
import { InvokePayload } from "@forge/bridge/out/types";
import { ErrorResponse } from "@shared/Types";

const handleForgeApiError = (errorResponse: ErrorResponse): Promise<never> => {
  const { errorType, message } = errorResponse;

  let isGlobalError = false;

  switch (errorType) {
    case "NOT_LICENSING":
      showErrorFlag({
        title: "Your license has expired",
        description: message,
      });
      isGlobalError = true;
      break;

    case "GENERAL":
      showErrorFlag({
        title: "Something went wrong",
        description: message,
      });
      isGlobalError = true;
      break;

    case "NO_PERMISSION":
      // Security: Show generic error message that doesn't reveal note existence
      // The message is already set in PERMISSION_ERROR_OBJECT on the backend
      showErrorFlag({
        title: message || "Invalid security note or decryption key",
        description:
          "Please verify the link and key, or contact the note creator if you believe this is an error.",
      });
      isGlobalError = false; // Not a global error, specific to the operation
      break;

    default:
      break;
  }

  throw new ApiError(errorResponse, isGlobalError);
};

export default {
  async request<T extends ErrorResponse>(
    functionKey: string,
    payload?: InvokePayload | undefined,
  ): Promise<T> {
    let response = await invoke<T>(functionKey, payload);

    if (response.isError && response.errorType === "INSTALLATION") {
      showWarningFlag({
        title: "App installation is in progress",
        description: "Please wait",
      });
      await new Promise((resolve) => setTimeout(resolve, 20000));
      response = await invoke<T>(functionKey, payload);
    }

    if (response.isError && response.errorType !== "INSTALLATION") {
      return handleForgeApiError(response as ErrorResponse);
    }

    return response;
  },

  get<T extends ErrorResponse>(functionKey: string): Promise<T> {
    return this.request<T>(functionKey);
  },

  post<T extends ErrorResponse>(
    functionKey: string,
    payload?: InvokePayload | undefined,
  ): Promise<T> {
    return this.request<T>(functionKey, payload);
  },

  put<T extends ErrorResponse>(
    functionKey: string,
    payload?: InvokePayload | undefined,
  ): Promise<T> {
    return this.request<T>(functionKey, payload);
  },

  delete<T extends ErrorResponse>(functionKey: string): Promise<T> {
    return this.request<T>(functionKey);
  },

  patch<T extends ErrorResponse>(
    functionKey: string,
    payload?: InvokePayload | undefined,
  ): Promise<T> {
    return this.request<T>(functionKey, payload);
  },
};
