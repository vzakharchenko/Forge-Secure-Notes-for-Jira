//libs
import { invoke } from "@forge/bridge";

// helpers
import { showErrorFlag, showWarningFlag } from "@src/shared/utils/flags";
import ApiError from "@src/shared/services/ApiError";

// models
import { RemoteClientResponse } from "@src/shared/models/remoteClient";
import { InvokePayload } from "@forge/bridge/out/types";
import { ErrorResponse } from "@src/Types";

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
        title: "Server error",
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
  async request<T>(functionKey: string, payload?: InvokePayload | undefined): Promise<T> {
    let response = await invoke<RemoteClientResponse<T>>(functionKey, payload);

    if (response.isError && response.errorType === "INSTALLATION") {
      showWarningFlag({
        title: "App installation is in progress",
        description: "Please wait",
      });
      await new Promise((resolve) => setTimeout(resolve, 20000));
      response = await invoke<RemoteClientResponse<T>>(functionKey, payload);
    }

    if (response.isError && response.errorType !== "INSTALLATION") {
      return handleForgeApiError(response as ErrorResponse);
    }

    return response.result as T;
  },

  get<T>(functionKey: string): Promise<T> {
    return this.request<T>(functionKey);
  },

  post<T>(functionKey: string, payload?: InvokePayload | undefined): Promise<T> {
    return this.request<T>(functionKey, payload);
  },

  put<T>(functionKey: string, payload?: InvokePayload | undefined): Promise<T> {
    return this.request<T>(functionKey, payload);
  },

  delete<T>(functionKey: string): Promise<T> {
    return this.request<T>(functionKey);
  },

  patch<T>(functionKey: string, payload?: InvokePayload | undefined): Promise<T> {
    return this.request<T>(functionKey, payload);
  },
};
