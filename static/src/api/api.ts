//libs
import { invoke } from "@forge/bridge";

// stores
// import InterfaceStore from "src/shared/store/InterfaceStore";
// helpers
// import ApiError from "@src/shared/services/ApiError";
// models
import { RemoteClientResponse } from "@src/shared/models/remoteClient";
import { InvokePayload } from "@forge/bridge/out/types";

// const handleForgeApiError = (
//   data: BaseFormServerValidation,
//   status: ResponseStatuses,
// ): Promise<never> => {
//   let isGlobalError = false;

// if (!status) {
//     InterfaceStore.setGlobalError({
//         title: "Unexpected error",
//         description: "Please try again later.",
//         requestId: data?.requestId ?? undefined,
//     });
//     throw new ApiError(data, status, true);
// }
//
// switch (status) {
//     case ResponseStatuses.UNAUTHORIZED:
//         InterfaceStore.setGlobalError({
//             title: "401 - Unauthorized",
//             description: "You are not authorized.",
//             requestId: data?.requestId ?? undefined,
//         });
//         isGlobalError = true;
//         break;
//
//     case ResponseStatuses.NO_LICENCE:
//         InterfaceStore.setGlobalError({
//             title: "Your license has expired",
//             description: "Please contact your Jira administrator.",
//             requestId: data?.requestId ?? undefined,
//         });
//         isGlobalError = true;
//         break;
//
//     case ResponseStatuses.MANY_REQUESTS:
//         InterfaceStore.setGlobalError({
//             title: "429 - Too many requests",
//             description: "Jira has reported too many requests. Please try again later.",
//             requestId: data?.requestId ?? undefined,
//         });
//         isGlobalError = true;
//         break;
//
//     case ResponseStatuses.SERVER_ERROR:
//         InterfaceStore.setGlobalError({
//             title: "500 - Server error",
//             description: "Something went wrong.",
//             requestId: data?.requestId ?? undefined,
//         });
//         isGlobalError = true;
//         break;
//
//     default:
//         break;
// }

//   throw new ApiError(data, status, isGlobalError);
// };

export default {
  async request<T>(functionKey: string, payload?: InvokePayload | undefined): Promise<T> {
    const response = await invoke<RemoteClientResponse<T>>(functionKey, payload);

    console.log("response", response);

    // TODO: implement global error handling
    return response.result;
    // const { status, body, headers } = response as {
    //     body: ServerResponseType<T, D>;
    //     status: ResponseStatuses;
    //     headers: Record<string, unknown>;
    // };
    //
    // if (status === ResponseStatuses.OK) {
    //     return {
    //         data: body,
    //         status,
    //         headers,
    //         config,
    //     };
    // }
    //
    // return handleForgeApiError(body as BaseFormServerValidation, status);
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
