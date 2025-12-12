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
